import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBookQuery, useDeleteBookMutation, useUpdateBookMutation } from '@/features/api/bookApi';
import { useGetReviewsQuery, useCreateReviewMutation, useLikeReviewMutation, useDeleteReviewMutation, useUnlikeReviewMutation } from '@/features/api/reviewApi';
import { Button } from "@/components/ui/button";
import BookForm from '@/components/admin/BookForm';
import ReviewCard from '@/components/review/ReviewCard';
import ReviewForm from '@/components/review/ReviewForm';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get authentication state and admin status
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.isAdmin;
  
  // Fetch book and reviews data
  const { data: book, error: bookError, isLoading: bookLoading } = useGetBookQuery(id);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsQuery(id);
  
  // Mutations
  const [deleteBook] = useDeleteBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [likeReview] = useLikeReviewMutation();
  const [unlikeReview] = useUnlikeReviewMutation();

  const handleDeleteBook = async () => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        await deleteBook(id).unwrap();
        navigate('/books');
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!isAuthenticated) {
      alert('Please log in to submit a review');
      return;
    }
    
    try {
      await createReview({
        book: id,
        ...reviewData
      }).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Error submitting review');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    const review = reviews?.find(r => r._id === reviewId);
    if (!review) return;
    
    // Only allow admin or review owner to delete
    if (!isAdmin && review.user?._id !== userInfo?._id) return;
    
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(reviewId).unwrap();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleReviewLike = async (reviewId) => {
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
  
  const handleReviewUnlike = async (reviewId) => {
    if (!isAuthenticated) {
      alert('Please log in to unlike reviews');
      return;
    }
    
    try {
      await unlikeReview(reviewId).unwrap();
    } catch (err) {
      console.error('Failed to unlike review:', err);
    }
  };
  
  const handleReviewEdit = (reviewId) => {
    navigate(`/reviews/edit/${reviewId}`);
  };

  if (bookLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Failed to load book details. Please try again later.</p>
        <p className="text-sm mt-2">{bookError.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Book not found</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="py-8">
        <Button onClick={() => setIsEditing(false)} className="mb-4">
          ← Back to Book Details
        </Button>
        <BookForm 
          initialData={book} 
          onSubmit={async (data) => {
            try {
              await updateBook({ id, ...data }).unwrap();
              setIsEditing(false);
            } catch (err) {
              console.error('Failed to update book:', err);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Admin Actions Bar */}
        {isAdmin && (
          <div className="bg-gray-50 p-4 flex justify-end space-x-4 border-b">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Book
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteBook}
            >
              Delete Book
            </Button>
          </div>
        )}

        {/* Book Details */}
        <div className="md:flex">
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
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {/* Review Form */}
          {isAuthenticated ? (
            <div className="mb-8">
              <ReviewForm
                onSubmit={handleReviewSubmit}
                isSubmitting={isSubmittingReview}
              />
            </div>
          ) : (
            <div className="text-center bg-gray-50 p-6 rounded-lg mb-8">
              <p className="mb-4">Please log in to write a review</p>
              <Button onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          )}
          
          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDelete={isAdmin || review.user?._id === userInfo?._id ? handleReviewDelete : undefined}
                  onLike={() => handleReviewLike(review._id)}
                  onUnlike={() => handleReviewUnlike(review._id)}
                  onEdit={
                    // Only allow review owner to edit their review
                    review.user?._id === userInfo?._id ? 
                    () => handleReviewEdit(review._id) : 
                    undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;