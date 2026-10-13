import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career.ts';
import { User } from '../models/User.ts';
import { Assessment } from '../models/Assessment.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { computeGapAnalysis } from '../services/gapAnalysisEngine.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// POST /api/assessment/evaluate/:careerSlug - Run skill-gap evaluation
router.post('/evaluate/:careerSlug', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = req.params.careerSlug;
    let career: any = null;
    if (mongoose.connection.readyState === 1) {
      career = await Career.findOne({ slug });
    }
    if (!career) {
      career = initialCareers.find((c) => c.slug === slug);
    }
    if (!career) {
      res.status(404).json({ error: 'Career not found' });
      return;
    }

    const userSkills = req.user?.assessedSkills || [];
    const result = computeGapAnalysis(career, userSkills);

    // If user is logged in and DB is connected, persist assessment
    if (req.user) {
      if (mongoose.connection.readyState === 1) {
        try {
          const assessment = new Assessment({
            userId: req.userId,
            careerId: career._id || undefined,
            careerSlug: career.slug,
            careerTitle: career.title,
            readinessScore: result.readinessScore,
            skillsMet: result.skillsMetCount,
            skillsPartial: result.skillsPartialCount,
            skillsMissing: result.skillsMissingCount,
            totalRequiredWeight: result.totalRequiredWeight,
            achievedWeightedScore: result.achievedWeightedScore,
            detailedSkills: result.detailedSkills,
            rankedGaps: result.rankedGaps,
            recommendedNextAction: result.recommendedNextAction
          });
          await assessment.save();

          await ActivityLog.create({
            userId: req.userId,
            actionType: 'assessment_completed',
            title: 'Skill-Gap Analysis Performed',
            description: `Calculated ${result.readinessScore}% readiness score for ${career.title}.`
          });
        } catch {
          // ignore non-fatal persistence errors
        }
      } else {
        demoStore.addActivity(req.userId || 'guest', {
          actionType: 'assessment_completed',
          title: 'Skill-Gap Analysis Performed',
          description: `Calculated ${result.readinessScore}% readiness score for ${career.title}.`
        });
      }
    }

    res.json({
      assessmentId: `eval-${Date.now()}`,
      career: {
        title: career.title,
        slug: career.slug,
        category: career.category
      },
      ...result
    });
  } catch (error: any) {
    console.error('[Assessment] Error evaluating skill gap:', error);
    res.status(500).json({ error: 'Failed to compute skill-gap analysis' });
  }
});

// GET /api/assessment/latest/:careerSlug - Get latest or compute live (works for guests and authenticated students)
router.get('/latest/:careerSlug', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = req.params.careerSlug;
    let career: any = null;
    if (mongoose.connection.readyState === 1) {
      career = await Career.findOne({ slug });
    }
    if (!career) {
      career = initialCareers.find((c) => c.slug === slug);
    }
    if (!career) {
      res.status(404).json({ error: 'Career not found' });
      return;
    }

    const userSkills = req.user?.assessedSkills || [];
    const result = computeGapAnalysis(career, userSkills);

    res.json({
      career: {
        title: career.title,
        slug: career.slug,
        category: career.category
      },
      ...result
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve assessment data' });
  }
});

// GET /api/assessment/history
router.get('/history', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.json({ history: [] });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const history = await Assessment.find({ userId: req.userId })
        .sort({ createdAt: 1 })
        .limit(30)
        .select('careerSlug careerTitle readinessScore skillsMet skillsPartial skillsMissing createdAt');
      res.json({ history });
      return;
    }

    res.json({ history: [] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve assessment history' });
  }
});

export default router;
