import { Router, Response } from 'express';
import { getDatabaseStatus, connectDB } from '../db.ts';
import { seedCareers } from '../seed.ts';
import { Career } from '../models/Career.ts';

const router = Router();

// GET /api/db-status - Live diagnostics for MongoDB Atlas connection
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const status = getDatabaseStatus();
    let careerCount = 0;
    if (status.connected) {
      try {
        careerCount = await Career.countDocuments();
      } catch {
        // ignore
      }
    }

    res.json({
      ...status,
      careerCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      status: 'error',
      message: error.message || 'Database status probe failed'
    });
  }
});

// POST /api/db-status/retry - Re-attempt MongoDB Atlas connection
router.post('/retry', async (req, res: Response): Promise<void> => {
  try {
    const status = await connectDB();
    let careerCount = 0;
    if (status.connected) {
      try {
        await seedCareers();
        careerCount = await Career.countDocuments();
      } catch {
        // ignore
      }
    }
    res.json({
      ...status,
      careerCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      status: 'error',
      message: error.message || 'Connection attempt failed'
    });
  }
});

// POST /api/db-status/seed - Manually trigger idempotent seed
router.post('/seed', async (req, res: Response): Promise<void> => {
  try {
    const seedResult = await seedCareers();
    res.json(seedResult);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

