import { Router, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { JWT_SECRET, requireAuth, AuthRequest } from '../middleware/auth.ts';
import { normalizeSkillName } from '../services/gapAnalysisEngine.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  degree: z.string().optional(),
  educationLevel: z.string().optional(),
  currentSemester: z.string().optional(),
  careerInterests: z.array(z.string()).optional(),
  preferredLearningPace: z.enum(['accelerated', 'moderate', 'relaxed']).optional(),
  initialSkills: z
    .array(
      z.object({
        skillName: z.string(),
        level: z.number().min(0).max(5),
        source: z.string().optional()
      })
    )
    .optional()
});

const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(1, 'Password required')
});

// POST /api/auth/register
router.post('/register', async (req, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Invalid input data' });
      return;
    }

    const {
      name,
      email,
      password,
      degree,
      educationLevel,
      currentSemester,
      careerInterests,
      preferredLearningPace,
      initialSkills
    } = parseResult.data;

    const normalizedEmail = email.toLowerCase().trim();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const formattedSkills = (initialSkills || []).map((s) => ({
      skillName: s.skillName.trim(),
      normalizedName: normalizeSkillName(s.skillName),
      level: s.level,
      source: s.source || 'Self-reported',
      evidence: '',
      updatedAt: new Date()
    }));

    let createdUser: any = null;

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        res.status(409).json({ error: 'An account with this email address already exists.' });
        return;
      }

      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        degree: degree || 'Computer Science & Engineering',
        educationLevel: educationLevel || 'Undergraduate',
        currentSemester: currentSemester || 'Year 3, Semester 1',
        careerInterests: careerInterests || [],
        preferredLearningPace: preferredLearningPace || 'moderate',
        assessedSkills: formattedSkills,
        targetCareerSlug: careerInterests && careerInterests.length > 0 ? careerInterests[0] : 'cybersecurity-analyst',
        savedCareers: []
      });

      await newUser.save();

      await ActivityLog.create({
        userId: newUser._id,
        actionType: 'skill_updated',
        title: 'Student Account Registered',
        description: `Welcome to CareerPath AI, ${newUser.name}! Your student profile has been created.`
      });

      createdUser = newUser.toObject();
      delete createdUser.passwordHash;
    } else {
      // Sandbox fallback mode when Atlas IP whitelist is pending
      const demoUser = {
        _id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        degree: degree || 'Computer Science & Engineering',
        educationLevel: educationLevel || 'Undergraduate',
        currentSemester: currentSemester || 'Year 3, Semester 1',
        careerInterests: careerInterests || [],
        preferredLearningPace: preferredLearningPace || 'moderate',
        assessedSkills: formattedSkills,
        targetCareerSlug: careerInterests && careerInterests.length > 0 ? careerInterests[0] : 'cybersecurity-analyst',
        savedCareers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      demoStore.saveUser(demoUser);
      demoStore.addActivity(demoUser._id, {
        actionType: 'skill_updated',
        title: 'Student Account Registered',
        description: `Welcome to CareerPath AI, ${demoUser.name}!`
      });

      createdUser = { ...demoUser };
      delete createdUser.passwordHash;
    }

    const token = jwt.sign(
      { userId: createdUser._id.toString(), email: createdUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: createdUser,
      dbConnected: mongoose.connection.readyState === 1
    });
  } catch (error: any) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ error: 'Server registration error: ' + (error.message || 'Unknown error') });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Invalid email or password' });
      return;
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    let user: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch {
        // fallback
      }
    }

    if (!user) {
      user = demoStore.getUserByEmail(normalizedEmail);
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    // Accept password match with bcrypt or default demo password 'password123'
    let isMatch = false;
    if (password === 'password123' && user._id.startsWith('demo-user')) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.passwordHash;

    res.json({
      message: 'Login successful',
      token,
      user: userObj,
      dbConnected: mongoose.connection.readyState === 1
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'Authentication service error.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ user: req.user, dbConnected: mongoose.connection.readyState === 1 });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      degree,
      educationLevel,
      currentSemester,
      careerInterests,
      preferredLearningPace,
      targetCareerSlug
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId);
      if (user) {
        if (name) user.name = name.trim();
        if (degree) user.degree = degree.trim();
        if (educationLevel) user.educationLevel = educationLevel;
        if (currentSemester) user.currentSemester = currentSemester;
        if (Array.isArray(careerInterests)) user.careerInterests = careerInterests;
        if (preferredLearningPace) user.preferredLearningPace = preferredLearningPace;
        if (targetCareerSlug) user.targetCareerSlug = targetCareerSlug;

        await user.save();
        const userObj = user.toObject();
        delete userObj.passwordHash;
        res.json({ message: 'Profile updated successfully', user: userObj });
        return;
      }
    }

    // Demo store update
    const demoUser = demoStore.getUserById(req.userId || '');
    if (demoUser) {
      if (name) demoUser.name = name.trim();
      if (degree) demoUser.degree = degree.trim();
      if (educationLevel) demoUser.educationLevel = educationLevel;
      if (currentSemester) demoUser.currentSemester = currentSemester;
      if (Array.isArray(careerInterests)) demoUser.careerInterests = careerInterests;
      if (preferredLearningPace) demoUser.preferredLearningPace = preferredLearningPace;
      if (targetCareerSlug) demoUser.targetCareerSlug = targetCareerSlug;
      demoUser.updatedAt = new Date();

      const userObj = { ...demoUser };
      delete (userObj as any).passwordHash;
      res.json({ message: 'Profile updated successfully', user: userObj });
      return;
    }

    res.status(404).json({ error: 'User not found' });
  } catch (error: any) {
    console.error('[Auth] Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res: Response): void => {
  res.json({ message: 'Logout successful' });
});

export default router;
