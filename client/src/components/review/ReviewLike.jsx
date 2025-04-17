import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { useLikeReviewMutation, useUnlikeReviewMutation, useGetReviewsQuery } from '@/features/api/reviewApi';
import { useGetMeQuery } from '@/features/api/authApi';

const ReviewLike = ({ reviewId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  
  // RTK Query hooks for liking/unliking
  const [likeReview, { isLoading: isLiking }] = useLikeReviewMutation();
  const [unlikeReview, { isLoading: isUnliking }] = useUnlikeReviewMutation();
  
  // Get fresh user data to determine liked status
  const { data: userData, refetch: refetchUserData } = useGetMeQuery(undefined, { 
    skip: !isAuthenticated 
  });

  // Check if user has liked this review from most up-to-date data
  useEffect(() => {
    // Check user data first (it's more up-to-date)
    if (userData?.likedReviews) {
      const isLiked = userData.likedReviews.some(id => id === reviewId);
      setHasLiked(isLiked);
    } 
    // Fall back to userInfo from Redux state
    else if (userInfo?.likedReviews) {
      const isLiked = userInfo.likedReviews.some(id => id === reviewId);
      setHasLiked(isLiked);
    }
  }, [reviewId, userInfo, userData]);
  
  // Update likes count when initialLikes changes
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like reviews');
      return;
    }

    // Don't allow multiple clicks while processing
    if (isLiking || isUnliking) return;

    try {
      if (hasLiked) {
        // Unlike the review
        const result = await unlikeReview(reviewId).unwrap();
        setLikes(result.likes);
        setHasLiked(false);
        // Explicitly refetch user data to ensure it's up-to-date
        refetchUserData();
      } else {
        // Like the review
        const result = await likeReview(reviewId).unwrap();
        setLikes(result.likes);
        setHasLiked(true);
        // Explicitly refetch user data to ensure it's up-to-date
        refetchUserData();
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // If we get an error that the review is already liked, update the UI accordingly
      if (error?.data?.message?.includes('already liked')) {
        setHasLiked(true);
      } else if (error?.data?.message?.includes('not liked')) {
        setHasLiked(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleToggleLike}
      disabled={isLiking || isUnliking}
      className={`flex items-center ${hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
      title={hasLiked ? "Unlike this review" : "Like this review"}
    >
      {/* Thumbs up icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-1" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
      {likes}
    </Button>
  );
};

export default ReviewLike;