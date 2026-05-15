import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByPhone,
  User,
} from '../models/user.model';

function generateToken(userId: string, role: string): string {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
}

function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'OWNER' | 'TENANT';
}) {
  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) throw new AppError('Email already in use', 409);

  const existingPhone = await findUserByPhone(data.phone);
  if (existingPhone) throw new AppError('Phone number already in use', 409);

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await createUser({ ...data, password: hashedPassword });
  const token = generateToken(user.id, user.role);

  return { user: sanitizeUser(user), token };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await findUserByEmail(data.email);
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user.id, user.role);

  return { user: sanitizeUser(user), token };
}

export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError('User not found', 404);
  return sanitizeUser(user);
}
