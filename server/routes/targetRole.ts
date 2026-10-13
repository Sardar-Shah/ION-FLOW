import express, { Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { TargetRole, ITargetRole } from '../models/TargetRole.ts';
import { Career } from '../models/Career.ts';
import { ResumeProfile } from '../models/ResumeProfile.ts';
import { JobDescriptionParserService } from '../services/jobDescriptionParser.ts';
import { FiveStageRoadmapService } from '../services/fiveStageRoadmapService.ts';
import { ReadinessEngineService } from '../services/readinessEngine.ts';
import { Roadmap } from '../models/Roadmap.ts';
import { Assessment } from '../models/Assessment.ts';
import mongoose from 'mongoose';

const router = express.Router();
const guestTargetRoles = new Map<string, any>();
const guestQuizzesPassed = new Map<string, Set<string>>();
const guestProjectsSubmitted = new Map<string, any[]>();

/**
 * POST /api/target-role/select
 * Selects or creates a target role (from recommendations, custom input, or job description)
 */
router.post('/select', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { roleType, title, slug, benchmarkSlug, jobText } = req.body;
    const userId = req.user ? req.user._id : undefined;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    if (!title && !slug && !benchmarkSlug && !jobText) {
      return res.status(400).json({ success: false, message: 'Role information or job description is required.' });
    }

    // Load candidate's latest resume skills
    let candidateSkills: any[] = [];
    if (mongoose.connection.readyState === 1) {
      const resume = await ResumeProfile.findOne(userId ? { userId } : { guestId }).sort({ updatedAt: -1 });
      if (resume && resume.skills) {
        candidateSkills = resume.skills;
      }
    }

    let targetRoleData: any = null;

    // 1. If an actual Job Description was provided:
    if (roleType === 'job_description' && jobText) {
      const parsed = JobDescriptionParserService.parseJobDescription(jobText, title || 'Target Employer Role');
      targetRoleData = {
        ...parsed,
        source: 'job_description',
        jobDescriptionText: jobText,
        isProvisionalBenchmark: false
      };
    }
    // 2. If selecting an existing Benchmark Career (one of the 12 existing careers):
    else if ((roleType === 'benchmark' || benchmarkSlug) && mongoose.connection.readyState === 1) {
      const bSlug = benchmarkSlug || slug;
      const existingCareer = await Career.findOne({ slug: bSlug });
      if (existingCareer) {
        targetRoleData = {
          title: existingCareer.title,
          slug: existingCareer.slug,
          category: existingCareer.category,
          description: existingCareer.description,
          source: 'benchmark',
          benchmarkSlug: existingCareer.slug,
          isProvisionalBenchmark: false,
          seniority: 'Entry-Level / Graduate',
          mandatorySkills: existingCareer.requiredSkills
            .filter((s: any) => s.importance === 'Required')
            .map((s: any) => ({
              name: s.canonicalName,
              category: s.category,
              minLevel: s.targetLevel,
              importance: s.importance,
              weight: s.weight,
              reason: s.description
            })),
          importantSkills: existingCareer.requiredSkills
            .filter((s: any) => s.importance === 'Important')
            .map((s: any) => ({
              name: s.canonicalName,
              category: s.category,
              minLevel: s.targetLevel,
              importance: s.importance,
              weight: s.weight,
              reason: s.description
            })),
          preferredSkills: existingCareer.requiredSkills
            .filter((s: any) => s.importance === 'Optional')
            .map((s: any) => ({
              name: s.canonicalName,
              category: s.category,
              minLevel: s.targetLevel,
              importance: s.importance,
              weight: s.weight,
              reason: s.description
            })),
          toolsAndTechnologies: existingCareer.requiredSkills.map((s: any) => s.canonicalName),
          practicalCapabilities: existingCareer.responsibilities,
          learningResources: existingCareer.learningResources,
          portfolioProjects: existingCareer.portfolioProjects,
          milestonesTemplate: existingCareer.milestonesTemplate,
          readinessQuizzes: existingCareer.requiredSkills.slice(0, 3).map((s: any, idx: number) => ({
            quizId: `quiz-${existingCareer.slug}-${idx}`,
            skillName: s.canonicalName,
            question: `In a production ${existingCareer.title} environment, how do you verify competency in ${s.canonicalName}?`,
            options: [
              `Enforce automated unit tests, clean abstractions, and review edge cases`,
              `Skip validation checks to speed up releases`,
              `Rely purely on manual QA right before shipping`,
              `Hardcode static variables in source files`
            ],
            correctAnswer: 0,
            explanation: `Industry engineering standards emphasize automated test coverage, type safety, and clean design patterns for ${s.canonicalName}.`
          }))
        };
      }
    }

    // 3. Fallback or Custom Career Title:
    if (!targetRoleData) {
      const customTitle = title || 'Custom Software Role';
      const provisional = JobDescriptionParserService.generateProvisionalBenchmark(customTitle);
      targetRoleData = {
        ...provisional,
        source: roleType === 'custom' ? 'custom' : 'recommended',
        isProvisionalBenchmark: true
      };
    }

    // Build personalized 5-Stage Roadmap
    const allRequiredForRoadmap = [
      ...targetRoleData.mandatorySkills,
      ...targetRoleData.importantSkills,
      ...targetRoleData.preferredSkills
    ];

    const roadmapData = FiveStageRoadmapService.generateFiveStageRoadmap({
      targetRoleTitle: targetRoleData.title,
      studentSkills: candidateSkills,
      requiredSkills: allRequiredForRoadmap
    });

    // Evaluate Readiness & Gap Analysis
    const gapAnalysis = ReadinessEngineService.evaluateReadiness({
      studentSkills: candidateSkills,
      roleRequirements: {
        mandatory: targetRoleData.mandatorySkills,
        important: targetRoleData.importantSkills,
        preferred: targetRoleData.preferredSkills
      }
    });

    // Persist TargetRole in MongoDB Atlas
    let savedRole: ITargetRole | null = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const query = userId ? { userId } : { guestId };
        savedRole = await TargetRole.findOneAndUpdate(
          query,
          {
            $set: {
              ...targetRoleData,
              userId,
              guestId
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Also save Roadmap in existing Roadmap collection
        if (userId) {
          await Roadmap.findOneAndUpdate(
            { userId, careerSlug: targetRoleData.slug },
            {
              $set: {
                careerTitle: targetRoleData.title,
                stages: roadmapData.stages,
                totalMilestones: roadmapData.totalMilestones,
                completedMilestones: roadmapData.completedMilestones,
                progressPercentage: roadmapData.progressPercentage
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          // Also save in Assessment collection for backward compatibility
          await Assessment.findOneAndUpdate(
            { userId, careerSlug: targetRoleData.slug },
            {
              $set: {
                careerTitle: targetRoleData.title,
                readinessScore: gapAnalysis.readinessScore,
                skillsMet: gapAnalysis.demonstratedCount,
                skillsPartial: gapAnalysis.partialCount,
                skillsMissing: gapAnalysis.missingCount,
                totalRequiredWeight: gapAnalysis.totalRequiredWeight,
                achievedWeightedScore: gapAnalysis.achievedWeightedScore,
                detailedSkills: gapAnalysis.detailedSkills.map((d) => ({
                  skillName: d.skillName,
                  category: d.category,
                  currentLevel: d.currentLevel,
                  targetLevel: d.targetLevel,
                  weight: d.weight,
                  importance: d.importance,
                  completionRatio: d.targetLevel > 0 ? d.currentLevel / d.targetLevel : 1,
                  status: d.status === 'demonstrated' ? 'met' : d.status === 'partial' ? 'partial' : 'missing'
                })),
                rankedGaps: gapAnalysis.topGaps.map((g) => ({
                  skillName: g.skillName,
                  category: g.category,
                  currentLevel: g.currentLevel,
                  targetLevel: g.targetLevel,
                  gap: Math.max(0, g.targetLevel - g.currentLevel),
                  importance: g.importance,
                  weight: g.weight
                })),
                recommendedNextAction: gapAnalysis.recommendedNextAction
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      } catch (dbErr: any) {
        console.warn('[TargetRoleRoute] DB save note:', dbErr.message);
      }
    }

    const payload = {
      targetRole: savedRole || targetRoleData,
      roadmap: roadmapData,
      gapAnalysis
    };

    guestTargetRoles.set(guestId, payload);
    if (userId) guestTargetRoles.set(userId.toString(), payload);

    return res.json({
      success: true,
      data: payload,
      message: `Selected "${targetRoleData.title}". Personalized 5-stage roadmap and gap analysis generated.`
    });
  } catch (error: any) {
    console.error('[TargetRoleRoute] Error selecting role:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/target-role/current
 * Returns current target role, roadmap, and gap analysis
 */
router.get('/current', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    // Check memory or DB
    let cached = (userId && guestTargetRoles.get(userId.toString())) || guestTargetRoles.get(guestId);

    if (!cached && mongoose.connection.readyState === 1) {
      const query = userId ? { userId } : { guestId };
      const roleDoc = await TargetRole.findOne(query).sort({ updatedAt: -1 });
      if (roleDoc) {
        const resume = await ResumeProfile.findOne(query).sort({ updatedAt: -1 });
        const candidateSkills = resume?.skills || [];

        const allRequired = [
          ...roleDoc.mandatorySkills,
          ...roleDoc.importantSkills,
          ...roleDoc.preferredSkills
        ];

        // Check if existing roadmap exists
        let existingStages: any = undefined;
        if (userId) {
          const rm = await Roadmap.findOne({ userId, careerSlug: roleDoc.slug });
          if (rm) existingStages = rm.stages;
        }

        const roadmapData = FiveStageRoadmapService.generateFiveStageRoadmap({
          targetRoleTitle: roleDoc.title,
          studentSkills: candidateSkills,
          requiredSkills: allRequired,
          existingStages
        });

        const passedSet = guestQuizzesPassed.get(guestId) || new Set<string>();
        const submittedProjects = guestProjectsSubmitted.get(guestId) || [];

        const gapAnalysis = ReadinessEngineService.evaluateReadiness({
          studentSkills: candidateSkills,
          roleRequirements: {
            mandatory: roleDoc.mandatorySkills,
            important: roleDoc.importantSkills,
            preferred: roleDoc.preferredSkills
          },
          verifiedProjectsCount: submittedProjects.length,
          quizzesPassedCount: passedSet.size
        });

        cached = {
          targetRole: roleDoc,
          roadmap: roadmapData,
          gapAnalysis
        };
      }
    }

    if (!cached) {
      // Return default starter role: Full-Stack Software Engineer
      const defaultParsed = JobDescriptionParserService.generateProvisionalBenchmark('Full-Stack Software Engineer');
      const defaultRoadmap = FiveStageRoadmapService.generateFiveStageRoadmap({
        targetRoleTitle: 'Full-Stack Software Engineer',
        studentSkills: [],
        requiredSkills: defaultParsed.mandatorySkills
      });
      const defaultGap = ReadinessEngineService.evaluateReadiness({
        studentSkills: [],
        roleRequirements: {
          mandatory: defaultParsed.mandatorySkills,
          important: defaultParsed.importantSkills,
          preferred: defaultParsed.preferredSkills
        }
      });

      cached = {
        targetRole: defaultParsed,
        roadmap: defaultRoadmap,
        gapAnalysis: defaultGap
      };
    }

    return res.json({ success: true, data: cached });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/target-role/verify-quiz
 * Verifies submitted readiness quiz answer and updates evidence score
 */
router.post('/verify-quiz', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, selectedAnswer } = req.body;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    if (quizId === undefined || selectedAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'quizId and selectedAnswer are required.' });
    }

    // Check answer against current target role quizzes
    const current = guestTargetRoles.get(guestId);
    const quizzes = current?.targetRole?.readinessQuizzes || [];
    const quiz = quizzes.find((q: any) => q.quizId === quizId);

    const isCorrect = quiz ? quiz.correctAnswer === selectedAnswer : selectedAnswer === 0;

    if (isCorrect) {
      if (!guestQuizzesPassed.has(guestId)) {
        guestQuizzesPassed.set(guestId, new Set<string>());
      }
      guestQuizzesPassed.get(guestId)!.add(quizId);
    }

    return res.json({
      success: true,
      isCorrect,
      explanation: quiz?.explanation || 'Verification recorded against target role rubrics.',
      totalQuizzesPassed: guestQuizzesPassed.get(guestId)?.size || 0
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/target-role/submit-project-evidence
 * Records project submission with repository link, demo URL, and notes
 */
router.post('/submit-project-evidence', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, repoUrl, liveUrl, notes } = req.body;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    if (!projectId || !repoUrl) {
      return res.status(400).json({ success: false, message: 'projectId and repoUrl are required.' });
    }

    if (!guestProjectsSubmitted.has(guestId)) {
      guestProjectsSubmitted.set(guestId, []);
    }

    const list = guestProjectsSubmitted.get(guestId)!;
    const existingIndex = list.findIndex((p) => p.projectId === projectId);
    const item = {
      projectId,
      repoUrl,
      liveUrl,
      notes,
      submittedAt: new Date(),
      status: 'verified'
    };

    if (existingIndex !== -1) {
      list[existingIndex] = item;
    } else {
      list.push(item);
    }

    return res.json({
      success: true,
      message: 'Project evidence attached successfully! Readiness score updated with practical bonus.',
      submittedProjects: list
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
