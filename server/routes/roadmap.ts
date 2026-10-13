import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career.ts';
import { User } from '../models/User.ts';
import { Roadmap } from '../models/Roadmap.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, requireAuth, AuthRequest } from '../middleware/auth.ts';
import { generatePersonalizedRoadmap } from '../services/roadmapGenerator.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// GET /api/roadmap/:careerSlug - Get or generate roadmap (works for guests and students)
router.get('/:careerSlug', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
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

    // If guest, generate template roadmap without requiring login
    if (!req.userId) {
      const generated = generatePersonalizedRoadmap(career, []);
      res.json({
        roadmap: {
          _id: `guest-${slug}`,
          careerSlug: slug,
          careerTitle: career.title,
          stages: generated.stages,
          totalMilestones: generated.totalMilestones,
          completedMilestones: 0,
          progressPercentage: 0
        }
      });
      return;
    }

    let roadmap: any = null;

    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ userId: req.userId, careerSlug: slug });
    } else {
      roadmap = demoStore.getRoadmap(req.userId, slug);
    }

    // Auto-generate if first time
    if (!roadmap) {
      const userSkills = req.user?.assessedSkills || [];
      const generated = generatePersonalizedRoadmap(career, userSkills);

      roadmap = {
        _id: `rdm-${Date.now()}`,
        userId: req.userId,
        careerId: career._id || undefined,
        careerSlug: slug,
        careerTitle: career.title,
        stages: generated.stages,
        totalMilestones: generated.totalMilestones,
        completedMilestones: generated.completedMilestones,
        progressPercentage: generated.progressPercentage
      };

      if (mongoose.connection.readyState === 1) {
        try {
          const doc = new Roadmap(roadmap);
          await doc.save();
          roadmap = doc;
        } catch {
          // ignore
        }
      } else {
        demoStore.saveRoadmap(req.userId, slug, roadmap);
        demoStore.addActivity(req.userId, {
          actionType: 'milestone_started',
          title: 'Roadmap Generated',
          description: `Personalized 5-stage roadmap generated for ${career.title}.`
        });
      }
    }

    res.json({ roadmap });
  } catch (error: any) {
    console.error('[Roadmap] Error retrieving roadmap:', error);
    res.status(500).json({ error: 'Failed to retrieve roadmap' });
  }
});

// POST /api/roadmap/generate/:careerSlug - Explicitly regenerate roadmap
router.post('/generate/:careerSlug', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
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
    const existingMap = new Map<string, 'not_started' | 'in_progress' | 'completed'>();

    if (req.userId) {
      if (mongoose.connection.readyState === 1) {
        const existing = await Roadmap.findOne({ userId: req.userId, careerSlug: slug });
        if (existing) {
          for (const st of existing.stages) {
            for (const m of st.milestones) {
              existingMap.set(m.milestoneId, m.status);
            }
          }
        }
      } else {
        const existing = demoStore.getRoadmap(req.userId, slug);
        if (existing) {
          for (const st of existing.stages) {
            for (const m of st.milestones) {
              existingMap.set(m.milestoneId, m.status);
            }
          }
        }
      }
    }

    const generated = generatePersonalizedRoadmap(career, userSkills, existingMap);

    let roadmapData = {
      _id: `rdm-${Date.now()}`,
      userId: req.userId || 'guest',
      careerId: career._id || undefined,
      careerSlug: slug,
      careerTitle: career.title,
      stages: generated.stages,
      totalMilestones: generated.totalMilestones,
      completedMilestones: generated.completedMilestones,
      progressPercentage: generated.progressPercentage
    };

    if (req.userId) {
      if (mongoose.connection.readyState === 1) {
        try {
          const updated = await Roadmap.findOneAndUpdate(
            { userId: req.userId, careerSlug: slug },
            { $set: roadmapData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          roadmapData = updated;
        } catch {
          // ignore
        }
      } else {
        demoStore.saveRoadmap(req.userId, slug, roadmapData);
      }
    }

    res.json({
      message: 'Roadmap regenerated successfully',
      roadmap: roadmapData,
      gapAnalysis: generated.gapAnalysis
    });
  } catch (error: any) {
    console.error('[Roadmap] Error generating roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// PATCH /api/roadmap/milestone/:careerSlug/:milestoneId - Update milestone status
router.patch('/milestone/:careerSlug/:milestoneId', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { careerSlug, milestoneId } = req.params;
    const { status } = req.body;

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid milestone status' });
      return;
    }

    const effectiveUserId = req.userId || 'guest-user';

    let roadmap: any = null;
    if (mongoose.connection.readyState === 1 && req.userId) {
      roadmap = await Roadmap.findOne({ userId: effectiveUserId, careerSlug });
    } else {
      roadmap = demoStore.getRoadmap(effectiveUserId, careerSlug);
    }

    if (!roadmap) {
      let career: any = null;
      if (mongoose.connection.readyState === 1) {
        career = await Career.findOne({ slug: careerSlug });
      }
      if (!career) {
        career = initialCareers.find((c) => c.slug === careerSlug);
      }
      if (career) {
        const generated = generatePersonalizedRoadmap(career, []);
        roadmap = {
          _id: `rm-${effectiveUserId}-${careerSlug}`,
          userId: effectiveUserId,
          careerSlug,
          careerTitle: career.title,
          stages: generated.stages,
          totalMilestones: generated.totalMilestones,
          completedMilestones: 0,
          progressPercentage: 0
        };
        demoStore.saveRoadmap(effectiveUserId, careerSlug, roadmap);
      }
    }

    if (!roadmap) {
      res.status(404).json({ error: 'Roadmap not found' });
      return;
    }

    let found = false;
    let milestoneTitle = '';
    let totalCompleted = 0;
    let totalCount = 0;

    for (const stage of roadmap.stages) {
      for (const m of stage.milestones) {
        totalCount++;
        if (m.milestoneId === milestoneId) {
          m.status = status;
          if (status === 'completed') {
            m.completedAt = new Date();
          }
          milestoneTitle = m.title;
          found = true;
        }
        if (m.status === 'completed') {
          totalCompleted++;
        }
      }
    }

    if (!found) {
      res.status(404).json({ error: 'Milestone not found in roadmap' });
      return;
    }

    roadmap.completedMilestones = totalCompleted;
    roadmap.totalMilestones = totalCount;
    roadmap.progressPercentage = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

    if (mongoose.connection.readyState === 1 && typeof roadmap.save === 'function') {
      await roadmap.save();
    } else {
      demoStore.saveRoadmap(effectiveUserId, careerSlug, roadmap);
      demoStore.addActivity(effectiveUserId, {
        actionType: status === 'completed' ? 'milestone_completed' : 'milestone_started',
        title: `Milestone ${status === 'completed' ? 'Completed' : 'Updated'}`,
        description: `${milestoneTitle} marked as ${status.replace('_', ' ')}.`
      });
    }

    res.json({
      message: `Milestone updated to ${status}`,
      roadmap
    });
  } catch (error: any) {
    console.error('[Roadmap] Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone status' });
  }
});

export default router;
