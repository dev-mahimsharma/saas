import { Response } from 'express';
import User from '@/models/User';
import { AuthRequest } from '@/types';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: 'Error retrieving profile' }); }
};
