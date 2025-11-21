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

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sentiview', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createOrUpdateAdmin() {
  try {
    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.username = username;
      if (password) user.password = await bcrypt.hash(password, 10);
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      const hashed = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashed, username, role: 'admin' });
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