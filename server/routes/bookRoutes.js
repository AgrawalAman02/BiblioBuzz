import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getBooks);
router.route('/featured').get(getFeaturedBooks);
router.route('/:id').get(getBookById);

// Protected routes - require authentication
router.route('/').post(protect, admin, createBook);
router.route('/:id')
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

export default router;