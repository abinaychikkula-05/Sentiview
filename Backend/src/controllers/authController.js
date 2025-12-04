/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, company } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Only allow @sentiview.com domain
    if (!email.toLowerCase().endsWith('@sentiview.com')) {
      return res.status(400).json({
        success: false,
        message: 'Only @sentiview.com email addresses are allowed for registration.',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
      company,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        company: user.company,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Debug logging: log incoming request headers for troubleshooting CORS/fetch failures
    try {
      console.log('🔐 Login attempt - headers:', {
        origin: req.get('origin'),
        host: req.get('host'),
        'user-agent': req.get('user-agent'),
        'content-type': req.get('content-type'),
        authorization: req.get('authorization'),
      });
    } catch (hdrErr) {
      console.warn('Could not read headers for login debug:', hdrErr.message);
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id, user.role);

    // Log successful login event (without sensitive data)
    console.log(`✅ Login success for user ${user.email} (${user._id})`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        company: user.company,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('❌ Login error (caught):', error && error.stack ? error.stack : error);
    next(error);
  }
};

/**
 * Get current logged-in user
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        company: user.company,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Setup endpoint - Promotes first admin user
 * POST /api/auth/setup
 * Requires: email, setupSecret
 * Note: Can only be used if no admin exists yet
 */
exports.setup = async (req, res, next) => {
  try {
    const { email, setupSecret } = req.body;

    // Validate inputs
    if (!email || !setupSecret) {
      return res.status(400).json({
        success: false,
        message: 'Email and setup secret required',
      });
    }

    // Validate setup secret matches environment variable
    const expectedSecret = process.env.SETUP_SECRET || 'dev-setup-secret';
    if (setupSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup secret',
      });
    }

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Setup can only be run once.',
      });
    }

    // Find and promote user to admin
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with verification
 * POST /api/auth/reset-password
 * Requires: username, email, oldPassword, newPassword
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { username, email, oldPassword, newPassword } = req.body;

    // Validation
    if (!username || !email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Find user by username and email
    const user = await User.findOne({
      $and: [{ username }, { email }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or email',
      });
    }

    // Verify old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
