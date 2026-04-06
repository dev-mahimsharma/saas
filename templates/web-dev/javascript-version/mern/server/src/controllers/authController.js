const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });
        const user = await User.create({ email, password, name });
        res.status(201).json({ token: generateToken(user._id), user: { id: user._id, email } });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
        res.json({ token: generateToken(user._id), user: { id: user._id, email } });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};
module.exports = { register, login };
