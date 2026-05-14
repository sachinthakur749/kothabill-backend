import { pool } from '../config/database';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'OWNER' | 'TENANT';
  photo_url?: string;
  address?: string;
  room_code?: string;
  created_at: Date;
  updated_at: Date;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool().query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  const result = await pool().query('SELECT * FROM users WHERE phone = $1', [phone]);
  return result.rows[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await pool().query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'OWNER' | 'TENANT';
}): Promise<User> {
  const result = await pool().query(
    `INSERT INTO users (name, email, phone, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.name, data.email, data.phone, data.password, data.role]
  );
  return result.rows[0];
}
