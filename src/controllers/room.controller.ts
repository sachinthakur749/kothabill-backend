import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { createRoomService, getMyRooms, joinRoom } from '../services/room.service';
import { sendSuccess } from '../utils/response';

export async function createRoomHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const room = await createRoomService({ owner_id: req.user.id, ...req.body });
    sendSuccess(res, room, 'Room created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyRoomsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const rooms = await getMyRooms(req.user.id);
    sendSuccess(res, rooms, 'Rooms fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function joinRoomHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await joinRoom({ room_code: req.body.room_code, user_id: req.user.id });
    sendSuccess(res, result, 'Joined room successfully', 201);
  } catch (error) {
    next(error);
  }
}
