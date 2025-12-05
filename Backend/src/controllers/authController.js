/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');

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
    const { username, email, oldPassword, newPassword, resetToken } = req.body;

    // Validation
    // Allow two flows: standard (oldPassword present) OR token-based (resetToken present)
    if (!username || !email || !newPassword || (!oldPassword && !resetToken)) {
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
    }).select('+password resetToken resetTokenExpires');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or email',
      });
    }

    // If resetToken provided, validate it
    if (resetToken) {
      if (!user.resetToken || !user.resetTokenExpires) {
        return res.status(401).json({ success: false, message: 'Reset token invalid or expired' });
      }
      if (user.resetToken !== resetToken || user.resetTokenExpires < Date.now()) {
        return res.status(401).json({ success: false, message: 'Reset token invalid or expired' });
      }
    } else {
      // Verify old password
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Old password is incorrect',
        });
      }
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear reset token after use
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send OTP to user's mobile for password reset
 * POST /api/auth/send-otp
 * Body: { username, email, mobile }
 */
exports.sendOTP = async (req, res, next) => {
  try {
    const { username, email, mobile } = req.body;
    if (!username || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'username, email and mobile required' });
    }

    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(expires);
    user.mobile = mobile;
    await user.save();

    // TODO: Integrate with SMS provider (Twilio) to send the OTP.
    console.log(`🔐 OTP for ${user.email} (${mobile}): ${otp} (expires in 10m)`);

    res.status(200).json({ success: true, message: 'OTP sent (simulated). Check server logs for OTP during development.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and issue a short-lived reset token
 * POST /api/auth/verify-otp
 * Body: { username, email, mobile, otp }
 */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { username, email, mobile, otp } = req.body;
    if (!username || !email || !mobile || !otp) {
      return res.status(400).json({ success: false, message: 'username, email, mobile and otp required' });
    }

    const user = await User.findOne({ username, email }).select('+resetOTP resetOTPExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetOTP || !user.resetOTPExpires || user.resetOTPExpires < Date.now()) {
      return res.status(401).json({ success: false, message: 'OTP expired or not found' });
    }

    if (user.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP valid: create a reset token (random string) valid for 15 minutes
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    // Clear OTP fields
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    console.log(`🔐 Reset token for ${user.email}: ${resetToken} (15m)`);

    res.status(200).json({ success: true, resetToken, message: 'OTP verified. Use resetToken to reset password.' });
  } catch (error) {
    next(error);
  }
};
