import { Response } from 'express';

export function sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res: Response, message: string, statusCode: number = 500): void {
  res.status(statusCode).json({
    success: false,
    message,
  });
}