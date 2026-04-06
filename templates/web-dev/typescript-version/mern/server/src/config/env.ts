import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const PORT = process.env.PORT || 5000;

if (!MONGO_URI || !JWT_SECRET) {
    console.error('Missing critical environment variables MONGO_URI or JWT_SECRET');
    process.exit(1);
}

export { MONGO_URI, JWT_SECRET, PORT };
