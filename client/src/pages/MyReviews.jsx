import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetReviewsQuery, useDeleteReviewMutation, useLikeReviewMutation, useUnlikeReviewMutation } from '@/features/api/reviewApi';
import ReviewCard from '@/components/review/ReviewCard';

const MyReviews = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Get all reviews if admin, otherwise get user's reviews
  const { data: reviews, isLoading, error: fetchError } = useGetReviewsQuery(undefined, {
    skip: !isAuthenticated
  });
  
  const [deleteReview] = useDeleteReviewMutation();
  const [likeReview] = useLikeReviewMutation();
  const [unlikeReview] = useUnlikeReviewMutation();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await deleteReview(reviewId).unwrap();
    } catch (err) {
      console.error('Failed to delete the review:', err);
    }
  };

  const handleEditReview = (reviewId) => {
    navigate(`/reviews/edit/${reviewId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading reviews...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {userInfo?.isAdmin ? 'All Reviews' : 'My Reviews'}
        </h1>
        {userInfo?.isAdmin && (
          <div className="text-sm text-gray-500">
            Viewing as admin - You can manage all reviews
          </div>
        )}
      </div>
      
      {fetchError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          Error: {fetchError.error || fetchError.data?.message || 'Could not fetch reviews'}
        </div>
      )}
      
      {!reviews?.length ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews found.</p>
          <Button asChild>
            <Link to="/books">Browse Books to Review</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews?.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showBookInfo={true}
              onDelete={userInfo?.isAdmin || review.user?._id === userInfo?._id ? handleDeleteReview : undefined}
              onEdit={
                // Allow edit if admin or review owner
                (userInfo?.isAdmin || review.user?._id === userInfo?._id) ? 
                () => handleEditReview(review._id) : 
                undefined
              }
              onLike={() => likeReview(review._id)}
              onUnlike={() => unlikeReview(review._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;