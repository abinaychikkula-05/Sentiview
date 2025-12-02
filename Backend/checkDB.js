const mongoose = require('mongoose');
const Feedback = require('./src/models/Feedback');
const User = require('./src/models/User');

// Connect to local DB
mongoose.connect('mongodb://127.0.0.1:27017/sentiview')
  .then(async () => {
    console.log('Connected to DB');
    
    const feedbackCount = await Feedback.countDocuments();
    console.log(`Total Feedback count: ${feedbackCount}`);
    
    const userCount = await User.countDocuments();
    console.log(`Total User count: ${userCount}`);
    
    const feedbacks = await Feedback.find().limit(5);
    console.log('Recent Feedback:', JSON.stringify(feedbacks, null, 2));

    const users = await User.find().limit(5);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
