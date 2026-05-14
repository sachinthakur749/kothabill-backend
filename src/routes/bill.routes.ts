import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validation';
import { authenticate, requireRole } from '../middlewares/auth';
import {
  createBillHandler,
  getBillsByTenantHandler,
  getMyBillsHandler,
  updateBillStatusHandler,
} from '../controllers/bill.controller';

const router = Router();

const createBillSchema = z.object({
  body: z.object({
    tenant_id: z.string().uuid('Invalid tenant ID'),
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format'),
    rent: z.number().positive('Rent must be positive'),
    electricity: z.number().min(0, 'Electricity cannot be negative'),
    water: z.number().min(0, 'Water cannot be negative'),
    dustbin: z.number().min(0, 'Dustbin cannot be negative'),
    note: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['DUE', 'PAID'], { message: 'Status must be DUE or PAID' }),
  }),
});

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Bill management
 */

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create a monthly bill for a tenant (Owner only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenant_id, month, rent, electricity, water, dustbin]
 *             properties:
 *               tenant_id:
 *                 type: string
 *                 description: Tenant link ID
 *                 example: "uuid-here"
 *               month:
 *                 type: string
 *                 example: "2026-05"
 *               rent:
 *                 type: number
 *                 example: 5000
 *               electricity:
 *                 type: number
 *                 example: 800
 *               water:
 *                 type: number
 *                 example: 200
 *               dustbin:
 *                 type: number
 *                 example: 100
 *               note:
 *                 type: string
 *                 example: "Late payment last month"
 *     responses:
 *       201:
 *         description: Bill created, total auto-calculated
 *       409:
 *         description: Bill for this month already exists
 *       404:
 *         description: Tenant not found
 */
router.post('/', authenticate, requireRole('OWNER'), validate(createBillSchema), createBillHandler);

/**
 * @swagger
 * /api/bills/my:
 *   get:
 *     summary: Get all bills for the logged-in tenant
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bills with room info
 */
router.get('/my', authenticate, requireRole('TENANT'), getMyBillsHandler);

/**
 * @swagger
 * /api/bills/tenant/{tenantId}:
 *   get:
 *     summary: Get bill history for a specific tenant (Owner only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant link ID
 *     responses:
 *       200:
 *         description: Bill history for the tenant
 *       403:
 *         description: Access denied
 *       404:
 *         description: Tenant not found
 */
router.get('/tenant/:tenantId', authenticate, requireRole('OWNER'), getBillsByTenantHandler);

/**
 * @swagger
 * /api/bills/{id}/status:
 *   patch:
 *     summary: Update bill status to PAID or DUE (Owner only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DUE, PAID]
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Bill status updated
 *       404:
 *         description: Bill not found
 */
router.patch('/:id/status', authenticate, requireRole('OWNER'), validate(updateStatusSchema), updateBillStatusHandler);

export default router;
