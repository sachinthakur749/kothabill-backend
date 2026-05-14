import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { getNotifications, markAsRead } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export async function getNotificationsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notifications = await getNotifications(req.user.id);
    sendSuccess(res, notifications, 'Notifications fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function markAsReadHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notification = await markAsRead(req.params.id, req.user.id);
    sendSuccess(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
}
