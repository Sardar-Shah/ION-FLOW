import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career.ts';
import { UserResourceProgress } from '../models/UserResourceProgress.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// GET /api/resources/:careerSlug - Get career resources (works for guests too)
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

    let tracked: any[] = [];
    if (req.userId) {
      if (mongoose.connection.readyState === 1) {
        tracked = await UserResourceProgress.find({
          userId: req.userId,
          careerSlug: slug
        });
      } else {
        tracked = demoStore.getResourceProgress(req.userId, slug);
      }
    }

    const trackedMap = new Map<string, any>();
    for (const t of tracked) {
      trackedMap.set(t.resourceUrl, t);
    }

    const resources = (career.learningResources || []).map((r: any) => {
      const t = trackedMap.get(r.url);
      return {
        ...r.toObject ? r.toObject() : r,
        userProgress: t
          ? {
              status: t.status,
              startedAt: t.startedAt,
              completedAt: t.completedAt
            }
          : {
              status: 'untracked'
            }
      };
    });

    res.json({ resources });
  } catch (error: any) {
    console.error('[Resources] Error retrieving resources:', error);
    res.status(500).json({ error: 'Failed to retrieve resources' });
  }
});

// POST /api/resources/track - Update resource status
router.post('/track', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resourceUrl, resourceTitle, careerSlug, status } = req.body;

    if (!resourceUrl || !careerSlug || !status) {
      res.status(400).json({ error: 'Missing required tracking fields' });
      return;
    }

    const effectiveUserId = req.userId || 'guest-user';

    const updateData: any = {
      resourceTitle: resourceTitle || 'Learning Resource',
      careerSlug,
      status
    };

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    let saved: any = null;

    if (mongoose.connection.readyState === 1 && req.userId) {
      saved = await UserResourceProgress.findOneAndUpdate(
        { userId: effectiveUserId, resourceUrl },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (status === 'completed') {
        await ActivityLog.create({
          userId: effectiveUserId,
          actionType: 'resource_completed',
          title: 'Resource Completed',
          description: `Completed reading/course: ${resourceTitle}.`
        });
      }
    } else {
      saved = demoStore.saveResourceProgress(effectiveUserId, resourceUrl, careerSlug, updateData);
      if (status === 'completed') {
        demoStore.addActivity(effectiveUserId, {
          actionType: 'resource_completed',
          title: 'Resource Completed',
          description: `Completed reading/course: ${resourceTitle}.`
        });
      }
    }

    res.json({ message: 'Resource status updated', progress: saved });
  } catch (error: any) {
    console.error('[Resources] Error tracking resource:', error);
    res.status(500).json({ error: 'Failed to update resource tracking' });
  }
});

export default router;
