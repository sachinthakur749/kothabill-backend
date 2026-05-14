import { pool } from '../config/database';

export interface Bill {
  id: string;
  room_id: string;
  owner_id: string;
  tenant_id: string;
  month: string;
  rent: number;
  electricity: number;
  water: number;
  dustbin: number;
  note?: string;
  status: 'DUE' | 'PAID';
  total: number;
  created_at: Date;
}

export async function createBill(data: {
  room_id: string;
  owner_id: string;
  tenant_id: string;
  month: string;
  rent: number;
  electricity: number;
  water: number;
  dustbin: number;
  note?: string;
  total: number;
}): Promise<Bill> {
  const result = await pool().query(
    `INSERT INTO bills (room_id, owner_id, tenant_id, month, rent, electricity, water, dustbin, note, total)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.room_id,
      data.owner_id,
      data.tenant_id,
      data.month,
      data.rent,
      data.electricity,
      data.water,
      data.dustbin,
      data.note || null,
      data.total,
    ]
  );
  return result.rows[0];
}

export async function findBillsByTenantLink(tenant_id: string): Promise<Bill[]> {
  const result = await pool().query(
    `SELECT b.*, r.room_number, r.address
     FROM bills b
     JOIN rooms r ON r.id = b.room_id
     WHERE b.tenant_id = $1
     ORDER BY b.month DESC`,
    [tenant_id]
  );
  return result.rows;
}

export async function findMyBills(user_id: string): Promise<Bill[]> {
  const result = await pool().query(
    `SELECT b.*, r.room_number, r.address
     FROM bills b
     JOIN tenant_links tl ON tl.id = b.tenant_id
     JOIN rooms r ON r.id = b.room_id
     WHERE tl.user_id = $1
     ORDER BY b.month DESC`,
    [user_id]
  );
  return result.rows;
}

export async function findBillById(id: string): Promise<Bill | null> {
  const result = await pool().query('SELECT * FROM bills WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function updateBillStatus(id: string, status: 'DUE' | 'PAID'): Promise<Bill | null> {
  const result = await pool().query(
    'UPDATE bills SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0] || null;
}

export async function findTenantLinkById(id: string) {
  const result = await pool().query('SELECT * FROM tenant_links WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function findExistingBill(tenant_id: string, month: string): Promise<Bill | null> {
  const result = await pool().query(
    'SELECT * FROM bills WHERE tenant_id = $1 AND month = $2',
    [tenant_id, month]
  );
  return result.rows[0] || null;
}
