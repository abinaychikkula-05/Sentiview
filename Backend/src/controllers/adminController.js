/**
 * Admin Controller
 * Handles admin-specific operations like user management and system stats
 */

const User = require('../models/User');
const Feedback = require('../models/Feedback');

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user and their feedback
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting the admin user himself
    if (user.role === 'admin' && req.user.userId === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account',
      });
    }

    // Delete all feedback from this user
    await Feedback.deleteMany({ userId: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User ${user.username} and all their feedback have been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 * PUT /api/admin/users/:id/role
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get system statistics
 * GET /api/admin/stats
 */
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const totalFeedback = await Feedback.countDocuments();

    // Get feedback statistics
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$sentiment.label',
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' },
        },
      },
    ]);

    // Get feedback by user
    const feedbackByUser = await Feedback.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get user details for top feedback contributors
    const topContributors = [];
    for (const entry of feedbackByUser) {
      const user = await User.findById(entry._id).select('username email');
      if (user) {
        topContributors.push({
          userId: entry._id,
          username: user.username,
          email: user.email,
          feedbackCount: entry.count,
        });
      }
    }

    // Get recent feedback
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username email');

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: regularUsers,
        },
        feedback: {
          total: totalFeedback,
          bySentiment: feedbackStats,
          topContributors,
          recent: recentFeedback,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get system activity log (last 50 users created)
 * GET /api/admin/activity
 */
exports.getActivityLog = async (req, res, next) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-password');

    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username email');

    res.status(200).json({
      success: true,
      activity: {
        recentUsers,
        recentFeedback,
      },
    });
  } catch (error) {
    next(error);
  }
};
