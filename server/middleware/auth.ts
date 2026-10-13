import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User.ts';
import { demoStore } from '../services/demoStore.ts';

export const JWT_SECRET = process.env.JWT_SECRET || 'careerpath_ai_secure_jwt_secret_key_university_2026';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
      return;
    }

    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: 'Malformed authentication token payload.' });
      return;
    }

    let user: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.userId).select('-passwordHash');
      } catch {
        // fallback
      }
    }

    if (!user) {
      user = demoStore.getUserById(decoded.userId);
    }

    if (!user) {
      res.status(401).json({ error: 'User account associated with this token not found.' });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error: any) {
    console.error('[AuthMiddleware] Error:', error);
    res.status(500).json({ error: 'Authentication processing error.' });
  }
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return next();
    }

    if (!decoded || !decoded.userId) {
      return next();
    }

    let user: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.userId).select('-passwordHash');
      } catch {
        // fallback
      }
    }

    if (!user) {
      user = demoStore.getUserById(decoded.userId);
    }

    if (user) {
      req.user = user;
      req.userId = user._id.toString();
    }

    next();
  } catch {
    next();
  }
}
