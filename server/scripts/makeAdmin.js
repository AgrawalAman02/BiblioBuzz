import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

/**
 * Script to make a user an admin by their email
 * Usage: node makeAdmin.js <email>
 */
async function makeUserAdmin(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    
    // Update user to be admin
    user.isAdmin = true;
    await user.save();
    
    console.log(`Successfully made ${user.username} (${email}) an admin`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

makeUserAdmin(email);