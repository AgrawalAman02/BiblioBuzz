import Review from '../models/Review.js';
import Book from '../models/Book.js';

/**
 * Get reviews for a specific book
 * @route GET /api/reviews?book=:bookId
 * @access Public
 */
export const getReviews = async (req, res) => {
  try {
    const { book: bookId } = req.query;
    
    // Validate book ID is provided
    if (!bookId) {
      res.status(400);
      throw new Error('Book ID is required');
    }
    
    // Find all reviews for the specified book
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching reviews: ' + error.message);
  }
};

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Private
 */
export const createReview = async (req, res) => {
  try {
    const { book: bookId, rating, title, content } = req.body;
    
    // Validation
    if (!bookId || !rating || !title || !content) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId
    });
    
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this book');
    }
    
    // Create the review
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating: Number(rating),
      title,
      content,
      likes: 0
    });
    
    // If review was created successfully
    if (review) {
      // Update book's average rating and review count
      await updateBookRatingStats(bookId);
      
      // Populate user information for the response
      await review.populate('user', 'username');
      
      res.status(201).json(review);
    } else {
      res.status(400);
      throw new Error('Invalid review data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error creating review: ' + error.message);
  }
};

/**
 * Update a review
 * @route PUT /api/reviews/:id
 * @access Private
 */
export const updateReview = async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    const review = await Review.findById(req.params.id);
    
    // Check if review exists
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    // Check if user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this review');
    }
    
    // Update review fields
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.content = content || review.content;
    
    const updatedReview = await review.save();
    
    // Update book's average rating
    await updateBookRatingStats(review.book);
    
    // Populate user information for the response
    await updatedReview.populate('user', 'username');
    
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error updating review: ' + error.message);
  }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:id
 * @access Private
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    // Check if review exists
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    // Check if user is the owner of the review or an admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('User not authorized to delete this review');
    }
    
    // Store book ID to update stats later
    const bookId = review.book;
    
    // Delete the review
    await review.deleteOne();
    
    // Update book's average rating and review count
    await updateBookRatingStats(bookId);
    
    res.status(200).json({ message: 'Review removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error deleting review: ' + error.message);
  }
};

/**
 * Like a review
 * @route PUT /api/reviews/:id/like
 * @access Private
 */
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    // Increment likes count
    review.likes += 1;
    await review.save();
    
    res.status(200).json({ likes: review.likes });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error liking review: ' + error.message);
  }
};

/**
 * Utility function to update a book's rating statistics
 * @param {string} bookId - ID of the book to update
 */
const updateBookRatingStats = async (bookId) => {
  // Get all reviews for the book
  const reviews = await Review.find({ book: bookId });
  
  if (reviews.length === 0) {
    // No reviews, reset stats
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      reviewCount: 0
    });
  } else {
    // Calculate new average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update the book
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
  }
};