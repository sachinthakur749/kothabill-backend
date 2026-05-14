import { AppError } from '../middlewares/errorHandler';
import {
  createRoom,
  createTenantLink,
  findExistingTenantLink,
  findRoomByCode,
  findRoomsByOwner,
} from '../models/room.model';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createRoomService(data: {
  owner_id: string;
  room_number: string;
  address: string;
}) {
  const room_code = generateRoomCode();
  const room = await createRoom({ ...data, room_code });
  return room;
}

export async function getMyRooms(owner_id: string) {
  return findRoomsByOwner(owner_id);
}

export async function joinRoom(data: { room_code: string; user_id: string }) {
  const room = await findRoomByCode(data.room_code);
  if (!room) throw new AppError('Invalid room code', 404);

  const existing = await findExistingTenantLink(room.id, data.user_id);
  if (existing) throw new AppError('You are already linked to this room', 409);

  const link = await createTenantLink({
    owner_id: room.owner_id,
    room_id: room.id,
    user_id: data.user_id,
  });

  return { room, link };
}
