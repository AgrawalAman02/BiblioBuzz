import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protects routes by requiring a valid JWT
 * Sets req.user if token is valid
 */
export const protect = async (req, res, next) => {
  try {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return next();
    }

    let token;
    
    // First check for token in cookies (preferred method for security)
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } 
    // Fallback to Authorization header for API clients
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in auth middleware'
    });
  }
};

/**
 * Middleware to restrict routes to admin users only
 * Must be used after the protect middleware
 */
export const admin = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as an admin'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in admin middleware'
    });
  }
};