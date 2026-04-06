const { Router } = require('express');
const { getProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = Router();

router.get('/me', verifyToken, getProfile);

module.exports = router;
