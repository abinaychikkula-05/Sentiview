/**
 * Auth Routes
 * Handles user authentication endpoints
 */

const express = require('express');
const { register, login, getMe, resetPassword, setup } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/reset-password', resetPassword);
router.post('/setup', setup);

module.exports = router;
