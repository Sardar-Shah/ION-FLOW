import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { User, IUserSkill } from '../models/User.ts';
import { Career } from '../models/Career.ts';
import { Roadmap } from '../models/Roadmap.ts';
import { Assessment } from '../models/Assessment.ts';
import { UserProjectProgress } from '../models/UserProjectProgress.ts';
import { UserResourceProgress } from '../models/UserResourceProgress.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { computeGapAnalysis } from '../services/gapAnalysisEngine.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// GET /api/dashboard/stats - Comprehensive student dashboard statistics (supports authenticated students and demo preview)
router.get('/stats', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user: any = req.user || demoStore.getUserById('demo-user-jane-cyber');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const targetSlug = user.targetCareerSlug || 'cybersecurity-analyst';
    let career: any = null;
    if (mongoose.connection.readyState === 1) {
      career = await Career.findOne({ slug: targetSlug });
    }
    if (!career) {
      career = initialCareers.find((c) => c.slug === targetSlug) || initialCareers[0];
    }

    // Run deterministic gap analysis for student's target career
    const gapAnalysis = computeGapAnalysis(career, user.assessedSkills || []);

    // Active roadmap stats
    let roadmap: any = null;
    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ userId: user._id, careerSlug: targetSlug });
    } else {
      roadmap = demoStore.getRoadmap(user._id, targetSlug);
    }

    const roadmapProgress = roadmap
      ? {
          totalMilestones: roadmap.totalMilestones,
          completedMilestones: roadmap.completedMilestones,
          progressPercentage: roadmap.progressPercentage,
          stagesCount: (roadmap.stages || []).length
        }
      : {
          totalMilestones: (career.milestonesTemplate || []).length,
          completedMilestones: 0,
          progressPercentage: 0,
          stagesCount: 5
        };

    // Portfolio project stats
    let projects: any[] = [];
    if (mongoose.connection.readyState === 1) {
      projects = await UserProjectProgress.find({ userId: user._id });
    } else {
      projects = demoStore.getProjectProgress(user._id, targetSlug);
    }
    const completedProjectsCount = projects.filter((p) => p.status === 'completed').length;
    const inProgressProjectsCount = projects.filter((p) => p.status === 'in_progress').length;
    const savedProjectsCount = projects.filter((p) => p.status === 'saved').length;

    // Resource stats
    let completedResourcesCount = 0;
    if (mongoose.connection.readyState === 1) {
      completedResourcesCount = await UserResourceProgress.countDocuments({
        userId: user._id,
        status: 'completed'
      });
    } else {
      completedResourcesCount = demoStore.getResourceProgress(user._id, targetSlug).filter((r) => r.status === 'completed').length;
    }

    // Profile completion calculation
    let profileScore = 0;
    if (user.name) profileScore += 15;
    if (user.degree && user.educationLevel) profileScore += 15;
    if (user.careerInterests && user.careerInterests.length > 0) profileScore += 15;
    if (user.targetCareerSlug) profileScore += 15;
    if ((user.assessedSkills || []).length >= 3) profileScore += 25;
    if (roadmap && roadmap.completedMilestones > 0) profileScore += 15;
    else if (projects.length > 0) profileScore += 15;
    const profileCompletionPercentage = Math.min(100, profileScore);

    // Recent activity
    let recentActivity: any[] = [];
    if (mongoose.connection.readyState === 1) {
      recentActivity = await ActivityLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(8);
    } else {
      recentActivity = demoStore.getActivity(user._id);
    }

    // Readiness history for chart
    let history: any[] = [];
    if (mongoose.connection.readyState === 1) {
      history = await Assessment.find({ userId: user._id })
        .sort({ createdAt: 1 })
        .limit(10)
        .select('readinessScore careerTitle createdAt');
    }

    // If history is empty, initialize with current live score
    const historyData =
      history.length > 0
        ? history.map((h) => ({
            date: new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            score: h.readinessScore,
            career: h.careerTitle
          }))
        : [
            {
              date: 'Current',
              score: gapAnalysis.readinessScore,
              career: career.title
            }
          ];

    // Skill distribution by category for charts
    const categoryDistribution: Record<string, { total: number; proficient: number }> = {};
    for (const skill of user.assessedSkills || []) {
      const cat = skill.normalizedName.includes('security')
        ? 'Cybersecurity'
        : skill.normalizedName.includes('sql') || skill.normalizedName.includes('data')
        ? 'Data'
        : skill.normalizedName.includes('react') || skill.normalizedName.includes('html') || skill.normalizedName.includes('css')
        ? 'Frontend'
        : 'Engineering';
      if (!categoryDistribution[cat]) {
        categoryDistribution[cat] = { total: 0, proficient: 0 };
      }
      categoryDistribution[cat].total += 1;
      if (skill.level >= 3) {
        categoryDistribution[cat].proficient += 1;
      }
    }

    const categoryChartData = Object.entries(categoryDistribution).map(([name, data]) => ({
      category: name,
      totalAssessed: data.total,
      proficient: data.proficient
    }));

    res.json({
      student: {
        id: user._id,
        name: user.name,
        email: user.email,
        degree: user.degree,
        educationLevel: user.educationLevel,
        currentSemester: user.currentSemester,
        preferredLearningPace: user.preferredLearningPace,
        profileCompletionPercentage,
        assessedSkillsCount: (user.assessedSkills || []).length
      },
      targetCareer: {
        title: career.title,
        slug: career.slug,
        category: career.category,
        description: career.description
      },
      readiness: {
        score: gapAnalysis.readinessScore,
        skillsMetCount: gapAnalysis.skillsMetCount,
        skillsPartialCount: gapAnalysis.skillsPartialCount,
        skillsMissingCount: gapAnalysis.skillsMissingCount,
        totalRequiredWeight: gapAnalysis.totalRequiredWeight,
        achievedWeightedScore: gapAnalysis.achievedWeightedScore,
        recommendedNextAction: gapAnalysis.recommendedNextAction,
        rankedGaps: gapAnalysis.rankedGaps.slice(0, 4)
      },
      roadmap: roadmapProgress,
      portfolio: {
        completed: completedProjectsCount,
        inProgress: inProgressProjectsCount,
        saved: savedProjectsCount,
        totalTracked: projects.length
      },
      resources: {
        completed: completedResourcesCount
      },
      historyData,
      categoryChartData,
      recentActivity
    });
  } catch (error: any) {
    console.error('[Dashboard] Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
  }
});

export default router;
