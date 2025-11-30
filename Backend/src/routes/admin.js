/**
 * Admin Routes
 * Protected admin endpoints for user management and system stats
 */

const express = require('express');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  getSystemStats,
  getActivityLog,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// All routes require admin role
router.use(adminOnly);

// User management endpoints
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// System statistics
router.get('/stats', getSystemStats);
router.get('/activity', getActivityLog);

module.exports = router;
