const mongoose = require('mongoose');
const User = require('./src/models/User');
const Feedback = require('./src/models/Feedback');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sentiview');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

const debug = async () => {
  await connectDB();

  console.log('\n--- USERS ---');
  const users = await User.find({});
  users.forEach(u => {
    console.log(`ID: ${u._id}, Email: ${u.email}, Username: ${u.username}`);
  });

  console.log('\n--- FEEDBACK ---');
  const feedback = await Feedback.find({});
  feedback.forEach(f => {
    console.log(`ID: ${f._id}, UserID: ${f.userId}, Client: ${f.clientName}, Text: ${f.feedback.substring(0, 20)}...`);
  });

  if (feedback.length > 0 && users.length > 0) {
    console.log('\n--- ANALYSIS ---');
    feedback.forEach(f => {
      const user = users.find(u => u._id.toString() === f.userId.toString());
      if (user) {
        console.log(`Feedback ${f._id} belongs to User ${user.email} (${user._id})`);
      } else {
        console.log(`⚠️ Feedback ${f._id} has ORPHANED UserID: ${f.userId}`);
      }
    });
  }

  process.exit();
};

debug();
