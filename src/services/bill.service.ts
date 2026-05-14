import { AppError } from '../middlewares/errorHandler';
import {
  createBill,
  findBillById,
  findBillsByTenantLink,
  findExistingBill,
  findMyBills,
  findTenantLinkById,
  updateBillStatus,
} from '../models/bill.model';

export async function createBillService(
  owner_id: string,
  data: {
    tenant_id: string;
    month: string;
    rent: number;
    electricity: number;
    water: number;
    dustbin: number;
    note?: string;
  }
) {
  const tenantLink = await findTenantLinkById(data.tenant_id);
  if (!tenantLink) throw new AppError('Tenant not found', 404);
  if (tenantLink.owner_id !== owner_id) throw new AppError('Access denied', 403);
  if (!tenantLink.is_active) throw new AppError('Tenant is no longer active', 400);

  const existing = await findExistingBill(data.tenant_id, data.month);
  if (existing) throw new AppError(`Bill for ${data.month} already exists for this tenant`, 409);

  const total = data.rent + data.electricity + data.water + data.dustbin;

  return createBill({
    room_id: tenantLink.room_id,
    owner_id,
    tenant_id: data.tenant_id,
    total,
    ...data,
  });
}

export async function getBillsByTenant(tenant_id: string, owner_id: string) {
  const tenantLink = await findTenantLinkById(tenant_id);
  if (!tenantLink) throw new AppError('Tenant not found', 404);
  if (tenantLink.owner_id !== owner_id) throw new AppError('Access denied', 403);

  return findBillsByTenantLink(tenant_id);
}

export async function getMyBills(user_id: string) {
  return findMyBills(user_id);
}

export async function updateBillStatusService(
  bill_id: string,
  status: 'DUE' | 'PAID',
  owner_id: string
) {
  const bill = await findBillById(bill_id);
  if (!bill) throw new AppError('Bill not found', 404);
  if (bill.owner_id !== owner_id) throw new AppError('Access denied', 403);

  return updateBillStatus(bill_id, status);
}
