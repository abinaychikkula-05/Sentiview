/**
 * Seed Database with Sample Feedback
 * Adds sample feedback data for testing and demonstration
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Import models
const User = require('../models/User');
const Feedback = require('../models/Feedback');

// Sample feedback data
const sampleFeedback = [
  {
    clientName: 'John Smith',
    feedback: 'The customer service was absolutely fantastic! Very responsive and helpful.',
    category: 'Support',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Sarah Johnson',
    feedback: 'I had a great experience with the product. Highly recommend!',
    category: 'Product',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Mike Chen',
    feedback: 'The app crashed multiple times. Very disappointed.',
    category: 'Technical',
    sentimentLabel: 'Negative',
    rating: 1,
  },
  {
    clientName: 'Emily Brown',
    feedback: 'The delivery took longer than expected, but the product quality is excellent.',
    category: 'Delivery',
    sentimentLabel: 'Neutral',
    rating: 3,
  },
  {
    clientName: 'David Wilson',
    feedback: 'Amazing service! Will definitely come back.',
    category: 'Service',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Lisa Anderson',
    feedback: 'The website is confusing and hard to navigate.',
    category: 'UX',
    sentimentLabel: 'Negative',
    rating: 2,
  },
  {
    clientName: 'Robert Taylor',
    feedback: 'The product is okay, nothing special.',
    category: 'Product',
    sentimentLabel: 'Neutral',
    rating: 3,
  },
  {
    clientName: 'Jennifer Lee',
    feedback: 'Excellent support team! They resolved my issue quickly.',
    category: 'Support',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Chris Martinez',
    feedback: 'The price is too high for what you get.',
    category: 'Pricing',
    sentimentLabel: 'Negative',
    rating: 2,
  },
  {
    clientName: 'Amanda Garcia',
    feedback: 'Good service overall. Met my expectations.',
    category: 'Service',
    sentimentLabel: 'Neutral',
    rating: 4,
  },
  {
    clientName: 'James Rodriguez',
    feedback: 'I absolutely love this product! Best purchase ever.',
    category: 'Product',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Patricia White',
    feedback: 'The customer service is rude and unhelpful.',
    category: 'Support',
    sentimentLabel: 'Negative',
    rating: 1,
  },
  {
    clientName: 'Mark Harris',
    feedback: 'Fast shipping and great packaging.',
    category: 'Delivery',
    sentimentLabel: 'Positive',
    rating: 5,
  },
  {
    clientName: 'Linda Clark',
    feedback: 'It works as described.',
    category: 'Product',
    sentimentLabel: 'Neutral',
    rating: 3,
  },
  {
    clientName: 'Charles Lewis',
    feedback: 'Could not get a refund even after returning the item.',
    category: 'Support',
    sentimentLabel: 'Negative',
    rating: 1,
  },
];

const seedDatabase = async (shouldConnect = true) => {
  try {
    // Connect to DB only if requested
    if (shouldConnect) {
      await connectDB();
      console.log('Connected to MongoDB');
    }

    // Find or create a test user
    let user = await User.findOne({ email: 'demo@sentiview.com' });
    
    if (!user) {
      user = new User({
        username: 'Demo User',
        email: 'demo@sentiview.com',
        password: 'demo123456', // Will be hashed by pre-save hook
        role: 'user',
      });
      await user.save();
      console.log('Created demo user: demo@sentiview.com (password: demo123456)');
    } else {
      console.log('Demo user already exists');
    }

    // Also create admin user if doesn't exist
    let admin = await User.findOne({ email: 'admin@sentiview.com' });
    if (!admin) {
      admin = new User({
        username: 'Admin',
        email: 'admin@sentiview.com',
        password: 'admin123456',
        role: 'admin',
      });
      await admin.save();
      console.log('Created admin user: admin@sentiview.com (password: admin123456)');
    } else {
      console.log('Admin user already exists');
    }

    // Check if feedback already exists
    const existingCount = await Feedback.countDocuments({ user: user._id });
    
    if (existingCount > 0) {
      console.log(`Demo user already has ${existingCount} feedback entries. Skipping seed.`);
      mongoose.connection.close();
      return;
    }

    // Create feedback entries with varied dates
    const feedbackDocs = sampleFeedback.map((item, index) => {
      // Create dates spread across last 7 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(index / 2));
      date.setHours(Math.random() * 24, Math.random() * 60, 0, 0);

      return {
        feedback: item.feedback,
        clientName: item.clientName,
        category: item.category,
        rating: item.rating,
        userId: user._id,
        sentiment: {
          label: item.sentimentLabel,
          score: item.sentimentLabel === 'Positive' ? 0.5 + Math.random() * 0.5 : 
                 item.sentimentLabel === 'Negative' ? -0.5 - Math.random() * 0.5 :
                 Math.random() * 0.2 - 0.1,
          confidence: 0.85 + Math.random() * 0.15,
        },
        createdAt: date,
      };
    });

    await Feedback.insertMany(feedbackDocs);
    console.log(`✅ Seeded ${feedbackDocs.length} feedback entries for demo user`);

    if (shouldConnect) {
      mongoose.connection.close();
    }
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (shouldConnect) process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
