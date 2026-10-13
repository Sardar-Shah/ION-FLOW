import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career.ts';
import { UserProjectProgress } from '../models/UserProjectProgress.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// GET /api/projects/:careerSlug - Get career projects merged with student progress (works for guests too)
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

    let userProgressList: any[] = [];
    if (req.userId) {
      if (mongoose.connection.readyState === 1) {
        userProgressList = await UserProjectProgress.find({
          userId: req.userId,
          careerSlug: slug
        });
      } else {
        userProgressList = demoStore.getProjectProgress(req.userId, slug);
      }
    }

    const progressMap = new Map<string, any>();
    for (const p of userProgressList) {
      progressMap.set(p.projectId, p);
    }

    const projectsWithProgress = (career.portfolioProjects || []).map((p: any) => {
      const progress = progressMap.get(p.projectId);
      return {
        ...p.toObject ? p.toObject() : p,
        userProgress: progress
          ? {
              status: progress.status,
              notes: progress.notes,
              repoUrl: progress.repoUrl,
              demoUrl: progress.demoUrl,
              startedAt: progress.startedAt,
              completedAt: progress.completedAt
            }
          : {
              status: 'untracked',
              notes: '',
              repoUrl: '',
              demoUrl: ''
            }
      };
    });

    res.json({ projects: projectsWithProgress });
  } catch (error: any) {
    console.error('[Projects] Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve portfolio projects' });
  }
});

// POST /api/projects/track - Track or update project progress
router.post('/track', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId, careerSlug, projectTitle, status, notes, repoUrl, demoUrl } = req.body;

    if (!projectId || !careerSlug) {
      res.status(400).json({ error: 'Missing projectId or careerSlug' });
      return;
    }

    const effectiveUserId = req.userId || 'guest-user';

    const updateData: any = {
      projectTitle: projectTitle || 'Portfolio Project',
      status: status || 'saved',
      notes: notes !== undefined ? notes : '',
      repoUrl: repoUrl !== undefined ? repoUrl : '',
      demoUrl: demoUrl !== undefined ? demoUrl : ''
    };

    if (status === 'in_progress') {
      updateData.startedAt = new Date();
    } else if (status === 'completed') {
      updateData.startedAt = updateData.startedAt || new Date();
      updateData.completedAt = new Date();
    }

    let savedProgress: any = null;

    if (mongoose.connection.readyState === 1 && req.userId) {
      savedProgress = await UserProjectProgress.findOneAndUpdate(
        { userId: effectiveUserId, projectId, careerSlug },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await ActivityLog.create({
        userId: effectiveUserId,
        actionType: status === 'completed' ? 'project_completed' : 'project_started',
        title: `Portfolio Project ${status === 'completed' ? 'Completed' : 'Updated'}`,
        description: `${projectTitle || projectId} is now ${status}.`
      });
    } else {
      savedProgress = demoStore.saveProjectProgress(effectiveUserId, projectId, careerSlug, updateData);
      demoStore.addActivity(effectiveUserId, {
        actionType: status === 'completed' ? 'project_completed' : 'project_started',
        title: `Portfolio Project ${status === 'completed' ? 'Completed' : 'Updated'}`,
        description: `${projectTitle || projectId} is now ${status}.`
      });
    }

    res.json({
      message: 'Project progress updated successfully',
      progress: savedProgress
    });
  } catch (error: any) {
    console.error('[Projects] Error updating project:', error);
    res.status(500).json({ error: 'Failed to update portfolio project' });
  }
});

// GET /api/projects/all-user-projects
router.get('/all-user-projects', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.json({ projects: [] });
      return;
    }
    if (mongoose.connection.readyState === 1) {
      const all = await UserProjectProgress.find({ userId: req.userId }).sort({ updatedAt: -1 });
      res.json({ projects: all });
      return;
    }
    res.json({ projects: [] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
});

export default router;
