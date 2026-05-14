import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { getAllTenants, getTenantDetail } from '../services/tenant.service';
import { sendSuccess } from '../utils/response';

export async function getAllTenantsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tenants = await getAllTenants(req.user.id);
    sendSuccess(res, tenants, 'Tenants fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getTenantDetailHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tenant = await getTenantDetail(req.params.id, req.user.id);
    sendSuccess(res, tenant, 'Tenant details fetched successfully');
  } catch (error) {
    next(error);
  }
}
