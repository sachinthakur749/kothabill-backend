import { AppError } from '../middlewares/errorHandler';
import {
  findNotificationsByUser,
  findNotificationById,
  markNotificationRead,
} from '../models/notification.model';

export async function getNotifications(user_id: string) {
  return findNotificationsByUser(user_id);
}

export async function markAsRead(id: string, user_id: string) {
  const notification = await findNotificationById(id);
  if (!notification) throw new AppError('Notification not found', 404);
  if (notification.user_id !== user_id) throw new AppError('Access denied', 403);

  return markNotificationRead(id);
}
