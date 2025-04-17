import express from 'express';
import {
  getReviews,
  getReviewById,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get reviews - public access
router.route('/').get(getReviews);

// Get user reviews - authenticated users only
router.route('/user').get(protect, getUserReviews);

// Protected routes - require authentication
router.route('/').post(protect, createReview);
router.route('/:id')
  .get(protect, getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);
router.route('/:id/like').put(protect, likeReview);

export default router;