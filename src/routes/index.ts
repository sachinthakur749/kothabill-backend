import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import tenantRoutes from './tenant.routes';
import billRoutes from './bill.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/tenants', tenantRoutes);
router.use('/bills', billRoutes);
router.use('/notifications', notificationRoutes);

export default router;