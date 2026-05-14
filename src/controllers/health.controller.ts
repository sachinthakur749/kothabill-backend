import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';

export async function getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }, 'Service is healthy');
  } catch (error) {
    next(error);
  }
}