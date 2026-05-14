import { pool } from '../config/database';

export async function findTenantsByOwner(owner_id: string) {
  const result = await pool().query(
    `SELECT
       tl.id AS link_id,
       tl.room_id,
       tl.joined_at,
       tl.is_active,
       u.id AS user_id,
       u.name,
       u.email,
       u.phone,
       u.photo_url,
       r.room_number,
       r.room_code,
       r.address
     FROM tenant_links tl
     JOIN users u ON u.id = tl.user_id
     JOIN rooms r ON r.id = tl.room_id
     WHERE tl.owner_id = $1 AND tl.is_active = true
     ORDER BY tl.joined_at DESC`,
    [owner_id]
  );
  return result.rows;
}

export async function findTenantDetailById(link_id: string, owner_id: string) {
  const tenantResult = await pool().query(
    `SELECT
       tl.id AS link_id,
       tl.room_id,
       tl.joined_at,
       tl.is_active,
       u.id AS user_id,
       u.name,
       u.email,
       u.phone,
       u.photo_url,
       r.room_number,
       r.room_code,
       r.address
     FROM tenant_links tl
     JOIN users u ON u.id = tl.user_id
     JOIN rooms r ON r.id = tl.room_id
     WHERE tl.id = $1 AND tl.owner_id = $2`,
    [link_id, owner_id]
  );

  if (!tenantResult.rows[0]) return null;

  const billsResult = await pool().query(
    `SELECT * FROM bills WHERE tenant_id = $1 ORDER BY month DESC`,
    [link_id]
  );

  return {
    ...tenantResult.rows[0],
    bills: billsResult.rows,
  };
}
