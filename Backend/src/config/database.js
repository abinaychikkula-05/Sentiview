/**
 * Database Configuration
 * Supports MongoDB with Mongoose ORM
 * Can be extended to support PostgreSQL with Sequelize
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('⚠️  WARNING: MONGODB_URI not set in environment variables');
      console.log('Using in-memory database for development');
      return null;
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Connection string format:', mongoUri.substring(0, 50) + '...');
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Check MONGODB_URI is set in Railway Variables');
    console.log('2. Verify password has no special characters or URL encode them');
    console.log('3. Check IP whitelist in MongoDB Atlas includes 0.0.0.0/0');
    console.log('4. Ensure database user exists in MongoDB Atlas\n');
    
    // In development, continue without MongoDB
    if (process.env.NODE_ENV !== 'production') {
      console.log('Running in development mode - continuing without MongoDB');
      return null;
    }
    
    // In production, wait a bit and retry once, then fail
    console.log('Retrying connection in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const retryConn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected on retry: ${retryConn.connection.host}`);
      return retryConn;
    } catch (retryError) {
      console.error(`❌ MongoDB Connection Failed after retry: ${retryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
