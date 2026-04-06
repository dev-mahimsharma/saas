import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/env';

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
