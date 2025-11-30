/**
 * Auth Routes
 * Handles user authentication endpoints
 */

const express = require('express');
const { register, login, getMe, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/reset-password', resetPassword);

module.exports = router;
