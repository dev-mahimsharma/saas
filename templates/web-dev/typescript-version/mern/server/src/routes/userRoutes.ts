import { Router } from 'express';
import { getProfile } from '@/controllers/userController';
import { verifyToken } from '@/middleware/authMiddleware';
const router = Router();

router.get('/me', verifyToken, getProfile);

export default router;
