const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
module.exports = connectDB;
