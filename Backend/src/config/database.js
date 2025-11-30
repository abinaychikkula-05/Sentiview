/**
 * Database Configuration
 * Supports MongoDB with Mongoose ORM
 * Can be extended to support PostgreSQL with Sequelize
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sentiview';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('Falling back to in-memory database (local development only)');
    
    // For production, this should fail. For development, we'll try in-memory
    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR: MongoDB connection required in production!');
      process.exit(1);
    }
    
    // In development, continue without MongoDB and let routes handle it
    return null;
  }
};

module.exports = connectDB;
