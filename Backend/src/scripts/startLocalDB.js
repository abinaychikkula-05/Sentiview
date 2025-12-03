const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  try {
    // Create an instance that binds to port 27017
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'sentiview',
      },
    });

    const uri = mongod.getUri();
    console.log(`Local MongoDB started successfully!`);
    console.log(`Connection URI: ${uri}`);
    console.log(`Ready to accept connections on port 27017...`);
    
    // Keep the process alive
    setInterval(() => {}, 10000);
    
    // Handle termination signals
    process.on('SIGTERM', async () => {
      await mongod.stop();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      await mongod.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start local MongoDB:', error);
    process.exit(1);
  }
})();
