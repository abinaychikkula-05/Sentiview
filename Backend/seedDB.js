const mongoose = require('mongoose');
const Feedback = require('./src/models/Feedback');

// Connect to local DB
mongoose.connect('mongodb://127.0.0.1:27017/sentiview')
  .then(async () => {
    console.log('Connected to DB');
    
    const userId = '692ddbf302e550378202c770'; // User 'trump'
    
    const feedback = new Feedback({
      userId: userId,
      clientName: 'Test Seed',
      feedback: 'This is a manually seeded feedback to test the dashboard.',
      sentiment: {
        label: 'Positive',
        score: 0.9,
        confidence: 0.99
      },
      rating: 5,
      category: 'Testing'
    });
    
    await feedback.save();
    console.log('Seeded feedback for user trump');
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
