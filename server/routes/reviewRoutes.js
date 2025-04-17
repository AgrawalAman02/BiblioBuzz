import express from 'express';
import {
  getReviews,
  getReviewById,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getReviews);

// Protected routes
router.route('/').post(protect, createReview);
router.route('/user').get(protect, getUserReviews);
router.route('/:id')
  .get(protect, getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

// Like/Unlike routes
router.route('/:id/like').put(protect, likeReview);
router.route('/:id/unlike').put(protect, unlikeReview);

export default router;