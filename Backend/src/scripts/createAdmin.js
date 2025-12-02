/**
 * Script to create or update an admin user in MongoDB
 * Usage: node src/scripts/createAdmin.js <email> <password> <username>
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

const [,, email, password, username] = process.argv;
if (!email || !password || !username) {
  console.error('Usage: node src/scripts/createAdmin.js <email> <password> <username>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sentiview', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createOrUpdateAdmin() {
  try {
    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.username = username;
      if (password) user.password = password; // Let the model pre-save hook hash it
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      // For new user, just pass plain password, model will hash it
      user = new User({ email, password, username, role: 'admin' });
      await user.save();
      console.log('Created new admin user:', email);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

createOrUpdateAdmin();