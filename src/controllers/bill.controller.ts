import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import {
  createBillService,
  getBillsByTenant,
  getMyBills,
  updateBillStatusService,
} from '../services/bill.service';
import { sendSuccess } from '../utils/response';

export async function createBillHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bill = await createBillService(req.user.id, req.body);
    sendSuccess(res, bill, 'Bill created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getBillsByTenantHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bills = await getBillsByTenant(req.params.tenantId, req.user.id);
    sendSuccess(res, bills, 'Bills fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getMyBillsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bills = await getMyBills(req.user.id);
    sendSuccess(res, bills, 'Bills fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateBillStatusHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bill = await updateBillStatusService(req.params.id, req.body.status, req.user.id);
    sendSuccess(res, bill, 'Bill status updated successfully');
  } catch (error) {
    next(error);
  }
}
