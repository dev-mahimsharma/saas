import 'module-alias/register'; // Used for compiled mode if needed
import express from 'express';
import cors from 'cors';
import connectDB from '@/config/db';
import { PORT } from '@/config/env';
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import { errorHandler } from '@/middleware/errorMiddleware';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
