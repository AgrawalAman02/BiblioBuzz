import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database using the connection string from environment variables
 * @returns {Promise} - MongoDB connection promise
 */
const connectDB = async () => {
  try {
    // if (!process.env.MONGO_URI) {
    //   console.error('Error: MONGO_URI is not defined in environment variables');
    //   process.exit(1);
    // }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;