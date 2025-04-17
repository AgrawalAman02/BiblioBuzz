import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authentication
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Set JWT token as HTTP-only cookie
 * @param {object} res - Express response object
 * @param {string} token - JWT token to set in cookie
 */
const setTokenCookie = (res, token) => {
  // Set JWT as HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV !== 'development', // Use secure in production
    sameSite: 'strict', // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      res.status(400);
      throw new Error('User with this email or username already exists');
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password
    });
    
    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      // Set HTTP-only cookie with the token
      setTokenCookie(res, token);
      
      // Send the response with user data (without sending token in the body for added security)
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error registering user: ' + error.message);
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate token
      const token = generateToken(user._id);
      
      // Set HTTP-only cookie with the token
      setTokenCookie(res, token);
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error authenticating user: ' + error.message);
  }
};

/**
 * Log out a user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logoutUser = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Error logging out: ' + error.message);
  }
};

/**
 * Get current user's profile data
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching user data: ' + error.message);
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    // User is already attached to req from auth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      // Update user fields
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      // Only update password if it's provided
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      // Generate a new token and set the cookie
      const token = generateToken(updatedUser._id);
      setTokenCookie(res, token);
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error updating user profile: ' + error.message);
  }
};