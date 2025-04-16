import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBookByIdQuery } from '@/features/api/bookApi';
import { useGetReviewsQuery, useCreateReviewMutation, useLikeReviewMutation } from '@/features/api/reviewApi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BookDetail = () => {
  const { id } = useParams();
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  
  // Get authentication state
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  
  // Fetch book and reviews data
  const { data: book, error: bookError, isLoading: bookLoading } = useGetBookByIdQuery(id);
  const { data: reviews, error: reviewsError, isLoading: reviewsLoading } = useGetReviewsQuery(id);
  
  // Mutations for creating reviews and liking reviews
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const [likeReview] = useLikeReviewMutation();

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to submit a review');
      return;
    }
    
    try {
      await createReview({
        book: id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content
      }).unwrap();
      
      // Reset form
      setReviewForm({ rating: 5, title: '', content: '' });
    } catch (err) {
      alert(err.data?.message || 'Error submitting review');
    }
  };
  
  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      alert('Please log in to like reviews');
      return;
    }
    
    try {
      await likeReview(reviewId).unwrap();
    } catch (err) {
      console.error('Failed to like review:', err);
    }
  };

  // Handle loading states
  if (bookLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error states
  if (bookError) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Failed to load book details. Please try again later.</p>
        <p className="text-sm mt-2">{bookError.message || 'Unknown error'}</p>
      </div>
    );
  }

  // If no book is found
  if (!book) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Book not found</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop';
              }}
            />
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-1 mr-2">{book.averageRating}</span>
              </div>
              <div className="text-gray-500">({book.reviewCount} reviews)</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genre && book.genre.map(g => (
                <span key={g} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="font-semibold">Published:</span> {book.publicationYear}
              </div>
              <div>
                <span className="font-semibold">Publisher:</span> {book.publisher}
              </div>
              <div>
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>
            
            <Button>Add to Reading List</Button>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {/* Review Form - Only show if user is authenticated */}
          {isAuthenticated ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <select
                      name="rating"
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      name="title"
                      value={reviewForm.title}
                      onChange={handleReviewChange}
                      placeholder="Summarize your review"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Review</label>
                    <textarea
                      name="content"
                      value={reviewForm.content}
                      onChange={handleReviewChange}
                      placeholder="Share your thoughts about this book"
                      required
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 bg-gray-50">
              <CardContent className="text-center py-6">
                <p className="mb-4">Please log in to write a review</p>
                <Button>Log In</Button>
              </CardContent>
            </Card>
          )}
          
          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : reviewsError ? (
            <div className="text-center py-4 text-red-500">
              <p>Failed to load reviews. Please try again later.</p>
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews?.map(review => (
              <Card key={review._id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    By {review.user?.username || 'Anonymous'} on {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{review.content}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center text-sm text-gray-500">
                    <button 
                      className="flex items-center hover:text-blue-600"
                      onClick={() => handleLikeReview(review._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {review.likes} likes
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;