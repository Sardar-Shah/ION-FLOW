import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Skill } from '../models/Skill.ts';
import { User, IUserSkill } from '../models/User.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { normalizeSkillName } from '../services/gapAnalysisEngine.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

const skillSchema = z.object({
  skillName: z.string().min(1, 'Skill name cannot be empty'),
  level: z.number().min(0).max(5),
  source: z.string().optional(),
  evidence: z.string().optional()
});

const batchSkillSchema = z.object({
  skills: z.array(skillSchema)
});

// GET /api/skills/directory - All canonical skills
router.get('/directory', async (req, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const skills = await Skill.find().sort({ category: 1, canonicalName: 1 });
      res.json({ skills, total: skills.length });
      return;
    }
    res.json({ skills: [], total: 0 });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve skills directory' });
  }
});

// GET /api/skills/user-skills - Current student's assessed skills (supports guests and logged-in students)
router.get('/user-skills', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user: any = req.user || demoStore.getUserById('demo-user-jane-cyber');
    res.json({ assessedSkills: user?.assessedSkills || [] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve student skills' });
  }
});

// POST /api/skills/user-skills - Add or update a single assessed skill
router.post('/user-skills', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parse = skillSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.issues[0]?.message || 'Invalid skill assessment payload' });
      return;
    }

    const { skillName, level, source, evidence } = parse.data;
    const user: any = req.user || demoStore.getUserById('demo-user-jane-cyber');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const normalized = normalizeSkillName(skillName);
    const existingIndex = (user.assessedSkills || []).findIndex(
      (s: IUserSkill) => s.normalizedName === normalized || s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    const newSkillRecord: IUserSkill = {
      skillName: skillName.trim(),
      normalizedName: normalized,
      level,
      source: source || 'Self-reported',
      evidence: evidence || '',
      updatedAt: new Date()
    };

    if (!user.assessedSkills) user.assessedSkills = [];

    if (existingIndex >= 0) {
      user.assessedSkills[existingIndex] = newSkillRecord;
    } else {
      user.assessedSkills.push(newSkillRecord);
    }

    if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
      await user.save();
      await ActivityLog.create({
        userId: user._id,
        actionType: 'skill_updated',
        title: 'Skill Assessment Updated',
        description: `Assessed ${skillName} at Level ${level}/5.`
      });
    } else {
      demoStore.saveUser(user);
      demoStore.addActivity(user._id, {
        actionType: 'skill_updated',
        title: 'Skill Assessment Updated',
        description: `Assessed ${skillName} at Level ${level}/5.`
      });
    }

    res.json({
      message: 'Skill assessment saved successfully',
      skill: newSkillRecord,
      assessedSkills: user.assessedSkills
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save skill assessment' });
  }
});

// POST /api/skills/user-skills/batch - Batch assessment (e.g. for onboarding or career skill checklist)
router.post('/user-skills/batch', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parse = batchSkillSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.issues[0]?.message || 'Invalid batch payload' });
      return;
    }

    const { skills } = parse.data;
    const user: any = req.user || demoStore.getUserById('demo-user-jane-cyber');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.assessedSkills) user.assessedSkills = [];

    for (const item of skills) {
      const normalized = normalizeSkillName(item.skillName);
      const existingIdx = user.assessedSkills.findIndex(
        (s: IUserSkill) => s.normalizedName === normalized || s.skillName.toLowerCase() === item.skillName.toLowerCase()
      );

      const record: IUserSkill = {
        skillName: item.skillName.trim(),
        normalizedName: normalized,
        level: item.level,
        source: item.source || 'Self-reported assessment',
        evidence: item.evidence || '',
        updatedAt: new Date()
      };

      if (existingIdx >= 0) {
        user.assessedSkills[existingIdx] = record;
      } else {
        user.assessedSkills.push(record);
      }
    }

    if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
      await user.save();
      await ActivityLog.create({
        userId: user._id,
        actionType: 'skill_updated',
        title: 'Batch Skills Assessed',
        description: `Updated ratings for ${skills.length} skills.`
      });
    } else {
      demoStore.saveUser(user);
      demoStore.addActivity(user._id, {
        actionType: 'skill_updated',
        title: 'Batch Skills Assessed',
        description: `Updated ratings for ${skills.length} skills.`
      });
    }

    res.json({
      message: `Successfully updated ${skills.length} skills`,
      assessedSkills: user.assessedSkills
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to batch update skills' });
  }
});

// DELETE /api/skills/user-skills/:skillName
router.delete('/user-skills/:skillName', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user: any = req.user || demoStore.getUserById('demo-user-jane-cyber');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const skillName = req.params.skillName;
    const normalized = normalizeSkillName(skillName);

    user.assessedSkills = (user.assessedSkills || []).filter(
      (s: IUserSkill) => s.normalizedName !== normalized && s.skillName.toLowerCase() !== skillName.toLowerCase()
    );

    if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
      await user.save();
    } else {
      demoStore.saveUser(user);
    }

    res.json({ message: 'Skill removed successfully', assessedSkills: user.assessedSkills });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove skill' });
  }
});

export default router;
