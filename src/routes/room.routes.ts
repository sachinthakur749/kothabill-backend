import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validation';
import { authenticate, requireRole } from '../middlewares/auth';
import { createRoomHandler, getMyRoomsHandler, joinRoomHandler } from '../controllers/room.controller';

const router = Router();

const createRoomSchema = z.object({
  body: z.object({
    room_number: z.string().min(1, 'Room number is required'),
    address: z.string().min(5, 'Address is required'),
  }),
});

const joinRoomSchema = z.object({
  body: z.object({
    room_code: z.string().length(8, 'Invalid room code'),
  }),
});

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room (Owner only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [room_number, address]
 *             properties:
 *               room_number:
 *                 type: string
 *                 example: "101"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Kathmandu"
 *     responses:
 *       201:
 *         description: Room created with generated roomCode
 *       403:
 *         description: Access denied
 */
router.post('/', authenticate, requireRole('OWNER'), validate(createRoomSchema), createRoomHandler);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms owned by the logged-in owner
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rooms with active tenant count
 *       403:
 *         description: Access denied
 */
router.get('/', authenticate, requireRole('OWNER'), getMyRoomsHandler);

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     summary: Join a room using a room code (Tenant only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [room_code]
 *             properties:
 *               room_code:
 *                 type: string
 *                 example: "AB12CD34"
 *     responses:
 *       201:
 *         description: Successfully joined the room
 *       404:
 *         description: Invalid room code
 *       409:
 *         description: Already linked to this room
 */
router.post('/join', authenticate, requireRole('TENANT'), validate(joinRoomSchema), joinRoomHandler);

export default router;
