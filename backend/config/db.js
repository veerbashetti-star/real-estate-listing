const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  // If no MONGO_URI provided, fall back to in-memory MongoDB for easy local testing
  if (!uri) {
    try {
      console.log('No MONGO_URI provided — starting in-memory MongoDB');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      // keep mongod reference so it isn't garbage-collected
      connectDB.__mongod = mongod;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
