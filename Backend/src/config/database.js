/**
 * Database Configuration
 * Supports MongoDB with Mongoose ORM
 * Can be extended to support PostgreSQL with Sequelize
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI environment variable is not defined.');
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ FATAL ERROR: You are running in production (e.g., Railway) but MONGODB_URI is missing.');
        console.error('   The app cannot connect to a database. Please set MONGODB_URI in your Railway Service Variables.');
        console.error('   Example: mongodb+srv://<user>:<password>@cluster.mongodb.net/sentiview');
      }
      // Fallback for local development
      mongoUri = 'mongodb://127.0.0.1:27017/sentiview';
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    // Mask password in logs
    const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
    console.log(`Connection string: ${maskedUri}`);
    
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
      console.log('⚠️ Local MongoDB not found. Attempting to start in-memory database...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          instance: {
            port: 27017,
            dbName: 'sentiview',
          }
        });
        const uri = mongod.getUri();
        console.log(`✅ In-memory MongoDB started at ${uri}`);
        
        const conn = await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        // Seed data automatically
        console.log('🌱 Seeding in-memory database...');
        const seedDatabase = require('../scripts/seedData');
        await seedDatabase(false);
        
        return conn;
      } catch (memError) {
        console.error('❌ Failed to start in-memory MongoDB:', memError);
      }

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
