import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { getAllTenantsHandler, getTenantDetailHandler } from '../controllers/tenant.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management (Owner only)
 */

/**
 * @swagger
 * /api/tenants:
 *   get:
 *     summary: Get all active tenants for the logged-in owner
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active tenants with room info
 *       403:
 *         description: Access denied
 */
router.get('/', authenticate, requireRole('OWNER'), getAllTenantsHandler);

/**
 * @swagger
 * /api/tenants/{id}:
 *   get:
 *     summary: Get tenant detail and full bill history
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant link ID
 *     responses:
 *       200:
 *         description: Tenant details with bill history
 *       404:
 *         description: Tenant not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticate, requireRole('OWNER'), getTenantDetailHandler);

export default router;
