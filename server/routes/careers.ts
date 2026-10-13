import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career.ts';
import { User } from '../models/User.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import { requireAuth, AuthRequest } from '../middleware/auth.ts';
import { initialCareers } from '../data/careersData.ts';
import { demoStore } from '../services/demoStore.ts';

const router = Router();

// GET /api/careers - Search, filter, and list careers
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;
    let query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { 'requiredSkills.canonicalName': { $regex: term, $options: 'i' } }
      ];
    }

    let careers: any[] = [];
    if (mongoose.connection.readyState === 1) {
      careers = await Career.find(query).sort({ title: 1 });
    }

    // If DB is offline or returned 0, filter from predefined seed library
    if (careers.length === 0) {
      careers = initialCareers.filter((c) => {
        const matchesCategory = !category || category === 'All' || c.category === category;
        const matchesSearch =
          !search ||
          typeof search !== 'string' ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()) ||
          c.requiredSkills.some((s) => s.canonicalName.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      }) as any;
    }

    const summaries = careers.map((c: any) => ({
      _id: c._id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      description: c.description,
      responsibilitiesCount: (c.responsibilities || []).length,
      requiredSkillsCount: (c.requiredSkills || []).length,
      learningResourcesCount: (c.learningResources || []).length,
      portfolioProjectsCount: (c.portfolioProjects || []).length,
      requiredSkillsSummary: (c.requiredSkills || []).slice(0, 4).map((s: any) => s.canonicalName)
    }));

    res.json({ careers: summaries, total: summaries.length });
  } catch (error: any) {
    console.error('[Careers] Error fetching careers:', error);
    res.status(500).json({ error: 'Failed to retrieve careers list: ' + (error?.message || error) });
  }
});

// GET /api/careers/compare?slugs=slug1,slug2
router.get('/compare', async (req, res: Response): Promise<void> => {
  try {
    const slugsParam = req.query.slugs as string;
    if (!slugsParam) {
      res.status(400).json({ error: 'Please provide comma-separated slugs query parameter' });
      return;
    }

    const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);
    let careers: any[] = [];
    if (mongoose.connection.readyState === 1) {
      careers = await Career.find({ slug: { $in: slugs } });
    }
    if (careers.length === 0) {
      careers = initialCareers.filter((c) => slugs.includes(c.slug)) as any;
    }

    res.json({ careers });
  } catch (error: any) {
    console.error('[Careers] Compare error:', error);
    res.status(500).json({ error: 'Failed to retrieve career comparison data' });
  }
});

// GET /api/careers/:slug - Detailed career profile
router.get('/:slug', async (req, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;
    let career: any = null;
    if (mongoose.connection.readyState === 1) {
      career = await Career.findOne({ slug });
    }

    if (!career) {
      const fallback = initialCareers.find((c) => c.slug === slug);
      if (fallback) {
        career = fallback;
      } else {
        res.status(404).json({ error: `Career with slug '${slug}' not found` });
        return;
      }
    }

    res.json({ career });
  } catch (error: any) {
    console.error('[Careers] Error fetching career by slug:', error);
    res.status(500).json({ error: 'Failed to fetch career details' });
  }
});

// POST /api/careers/favorite/:slug - Toggle favorite
router.post('/favorite/:slug', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user: any = req.user;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const slug = req.params.slug;
    if (!user.savedCareers) user.savedCareers = [];
    const exists = user.savedCareers.includes(slug);

    if (exists) {
      user.savedCareers = user.savedCareers.filter((s: string) => s !== slug);
    } else {
      user.savedCareers.push(slug);
    }

    if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
      await user.save();
    } else {
      demoStore.saveUser(user);
    }

    res.json({
      savedCareers: user.savedCareers,
      isSaved: !exists,
      message: exists ? 'Removed from saved careers' : 'Added to saved careers'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update favorite career' });
  }
});

// POST /api/careers/set-target/:slug - Choose target career
router.post('/set-target/:slug', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user: any = req.user;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const slug = req.params.slug;
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

    user.targetCareerId = career._id || undefined;
    user.targetCareerSlug = career.slug;

    if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
      await user.save();
      await ActivityLog.create({
        userId: user._id,
        actionType: 'target_career_selected',
        title: 'Target Career Selected',
        description: `Target career set to ${career.title}. Skill-gap analysis updated.`
      });
    } else {
      demoStore.saveUser(user);
      demoStore.addActivity(user._id, {
        actionType: 'target_career_selected',
        title: 'Target Career Selected',
        description: `Target career set to ${career.title}. Skill-gap analysis updated.`
      });
    }

    res.json({
      message: `Target career updated to ${career.title}`,
      targetCareerSlug: career.slug,
      targetCareerTitle: career.title
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to set target career' });
  }
});

export default router;
