import { AppError } from '../middlewares/errorHandler';
import { findTenantsByOwner, findTenantDetailById } from '../models/tenant.model';

export async function getAllTenants(owner_id: string) {
  return findTenantsByOwner(owner_id);
}

export async function getTenantDetail(link_id: string, owner_id: string) {
  const tenant = await findTenantDetailById(link_id, owner_id);
  if (!tenant) throw new AppError('Tenant not found', 404);
  return tenant;
}
