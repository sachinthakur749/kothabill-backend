import { pool } from '../config/database';

export interface Notification {
  id: string;
  user_id: string;
  bill_id?: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

export async function findNotificationsByUser(user_id: string): Promise<Notification[]> {
  const result = await pool().query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
}

export async function findNotificationById(id: string): Promise<Notification | null> {
  const result = await pool().query('SELECT * FROM notifications WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function markNotificationRead(id: string): Promise<Notification | null> {
  const result = await pool().query(
    'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}

export async function createNotification(data: {
  user_id: string;
  bill_id?: string;
  message: string;
}): Promise<Notification> {
  const result = await pool().query(
    `INSERT INTO notifications (user_id, bill_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.user_id, data.bill_id || null, data.message]
  );
  return result.rows[0];
}
