import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './server/db.ts';
import { seedCareers } from './server/seed.ts';
import authRoutes from './server/routes/auth.ts';
import careerRoutes from './server/routes/careers.ts';
import skillRoutes from './server/routes/skills.ts';
import assessmentRoutes from './server/routes/assessment.ts';
import roadmapRoutes from './server/routes/roadmap.ts';
import projectRoutes from './server/routes/projects.ts';
import resourceRoutes from './server/routes/resources.ts';
import dashboardRoutes from './server/routes/dashboard.ts';
import dbStatusRoutes from './server/routes/dbStatus.ts';
import resumeRoutes from './server/routes/resume.ts';
import targetRoleRoutes from './server/routes/targetRole.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic CORS & Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Mount API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/assessment', assessmentRoutes);
  app.use('/api/roadmap', roadmapRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/db-status', dbStatusRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/target-role', targetRoleRoutes);

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CareerPath AI API',
      timestamp: new Date().toISOString()
    });
  });

  // Attempt database connection & idempotent seed with graceful resilience
  (async () => {
    try {
      console.log('[Server] Connecting to MongoDB Atlas (ionflow.skdrbqo.mongodb.net)...');
      const dbStatus = await connectDB();
      if (dbStatus.connected) {
        console.log('[Server] MongoDB connected. Ensuring career library seed...');
        await seedCareers();
      } else {
        console.info(`[Server] Atlas status: ${dbStatus.message}`);
        if (dbStatus.actionRequired) {
          console.info(`[Server] Configuration note: ${dbStatus.actionRequired}`);
        }

        // Set up periodic background retry if pending whitelist
        const retryInterval = setInterval(async () => {
          try {
            const retryStatus = await connectDB();
            if (retryStatus.connected) {
              console.log('[Server] MongoDB Atlas connection successfully established!');
              await seedCareers();
              clearInterval(retryInterval);
            }
          } catch {
            // Keep retry in background
          }
        }, 30000);
      }
    } catch (dbErr: any) {
      console.info('[Server] Non-fatal DB startup note:', dbErr.message);
    }
  })();

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] CareerPath AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
