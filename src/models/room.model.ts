import { pool } from '../config/database';

export interface Room {
  id: string;
  owner_id: string;
  room_number: string;
  room_code: string;
  address: string;
  created_at: Date;
}

export interface TenantLink {
  id: string;
  owner_id: string;
  room_id: string;
  user_id: string;
  joined_at: Date;
  is_active: boolean;
}

export async function createRoom(data: {
  owner_id: string;
  room_number: string;
  room_code: string;
  address: string;
}): Promise<Room> {
  const result = await pool().query(
    `INSERT INTO rooms (owner_id, room_number, room_code, address)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.owner_id, data.room_number, data.room_code, data.address]
  );
  return result.rows[0];
}

export async function findRoomsByOwner(owner_id: string): Promise<Room[]> {
  const result = await pool().query(
    `SELECT r.*, COUNT(tl.id) FILTER (WHERE tl.is_active = true) AS active_tenants
     FROM rooms r
     LEFT JOIN tenant_links tl ON tl.room_id = r.id
     WHERE r.owner_id = $1
     GROUP BY r.id
     ORDER BY r.created_at DESC`,
    [owner_id]
  );
  return result.rows;
}

export async function findRoomByCode(room_code: string): Promise<Room | null> {
  const result = await pool().query('SELECT * FROM rooms WHERE room_code = $1', [room_code]);
  return result.rows[0] || null;
}

export async function findRoomById(id: string): Promise<Room | null> {
  const result = await pool().query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function findExistingTenantLink(
  room_id: string,
  user_id: string
): Promise<TenantLink | null> {
  const result = await pool().query(
    'SELECT * FROM tenant_links WHERE room_id = $1 AND user_id = $2 AND is_active = true',
    [room_id, user_id]
  );
  return result.rows[0] || null;
}

export async function createTenantLink(data: {
  owner_id: string;
  room_id: string;
  user_id: string;
}): Promise<TenantLink> {
  const result = await pool().query(
    `INSERT INTO tenant_links (owner_id, room_id, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.owner_id, data.room_id, data.user_id]
  );
  return result.rows[0];
}
