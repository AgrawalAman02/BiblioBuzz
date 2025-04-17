import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

/**
 * Get reviews for a specific book or all reviews
 * @route GET /api/reviews
 * @access Public
 */
export const getReviews = async (req, res) => {
  try {
    const { book: bookId } = req.query;
    let query = {};
    
    // If bookId is provided, get reviews for that book
    if (bookId) {
      query.book = bookId;
    }
    
    // Find reviews based on query
    const reviews = await Review.find(query)
      .populate('user', 'username')
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
    
    // Transform reviews to include hasLiked status if user is authenticated
    const transformedReviews = reviews.map(review => {
      const reviewObj = review.toObject();
      if (req.user) {
        reviewObj.hasLiked = req.user.likedReviews.includes(review._id);
      } else {
        reviewObj.hasLiked = false;
      }
      return reviewObj;
    });
    
    res.status(200).json(transformedReviews);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching reviews: ' + error.message);
  }
};

/**
 * Get a specific review by ID
 * @route GET /api/reviews/:id
 * @access Private
 */
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username');

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    res.status(200).json(review);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching review: ' + error.message);
  }
};

/**
 * Get all reviews by the logged in user
 * @route GET /api/reviews/user
 * @access Private
 */
export const getUserReviews = async (req, res) => {
  try {
    // Find all reviews by the current user
    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author coverImage')
      .sort({ createdAt: -1 });
    
    // Transform reviews to include hasLiked status
    const transformedReviews = reviews.map(review => {
      const reviewObj = review.toObject();
      reviewObj.hasLiked = req.user.likedReviews.includes(review._id);
      return reviewObj;
    });
    
    res.status(200).json(transformedReviews);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error fetching user reviews: ' + error.message);
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

    // Add review to user's liked reviews if not already liked
    const user = await User.findById(req.user._id);
    if (!user.likedReviews.includes(review._id)) {
      user.likedReviews.push(review._id);
      await user.save();

      // Increment likes count
      review.likes += 1;
      await review.save();
    }

    res.json({
      likes: review.likes,
      hasLiked: true
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error liking review: ' + error.message);
  }
};

/**
 * Unlike a review
 * @route PUT /api/reviews/:id/unlike
 * @access Private
 */
export const unlikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Remove review from user's liked reviews if present
    const user = await User.findById(req.user._id);
    const index = user.likedReviews.indexOf(review._id);
    if (index > -1) {
      user.likedReviews.splice(index, 1);
      await user.save();

      // Decrement likes count
      review.likes = Math.max(0, review.likes - 1);
      await review.save();
    }

    res.json({
      likes: review.likes,
      hasLiked: false
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error('Error unliking review: ' + error.message);
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