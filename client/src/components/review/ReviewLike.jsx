import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { useLikeReviewMutation, useUnlikeReviewMutation } from '@/features/api/reviewApi';

const ReviewLike = ({ reviewId, initialLikes, initialHasLiked }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [likeReview, { isLoading: isLiking }] = useLikeReviewMutation();
  const [unlikeReview, { isLoading: isUnliking }] = useUnlikeReviewMutation();

  // Update likes count and hasLiked when props change
  useEffect(() => {
    setLikes(initialLikes);
    setHasLiked(initialHasLiked);
  }, [initialLikes, initialHasLiked]);

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
        setHasLiked(result.hasLiked);
      } else {
        // Like the review
        const result = await likeReview(reviewId).unwrap();
        setLikes(result.likes);
        setHasLiked(result.hasLiked);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
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