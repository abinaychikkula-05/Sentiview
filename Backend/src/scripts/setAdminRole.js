/**
 * Set Admin Role Script
 * Updates a user's role to admin
 * Usage: MONGODB_URI=... node src/scripts/setAdminRole.js
 */

require('dotenv').config({ path: '../../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

async function setAdminRole(email) {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    // Update role
    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${email} role updated to admin`);
    console.log(`User ID: ${user._id}`);
    console.log(`Username: ${user.username}`);
    console.log(`New role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'admin@sentiview.com';
setAdminRole(email);
