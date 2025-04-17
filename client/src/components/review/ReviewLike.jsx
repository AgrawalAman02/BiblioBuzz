import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";

const ReviewLike = ({ reviewId, initialLikes, onLike, onUnlike }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  
  // Check if user has liked this review from server response
  useEffect(() => {
    if (userInfo?.likedReviews) {
      setHasLiked(userInfo.likedReviews.includes(reviewId));
    }
  }, [reviewId, userInfo]);
  
  // Update likes count when it changes
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like reviews');
      return;
    }

    try {
      if (hasLiked) {
        await onUnlike();
      } else {
        await onLike();
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleToggleLike}
      className={`flex items-center ${hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-1" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          d={hasLiked 
            ? "M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
            : "M14 10h4v2h-4v4h-2v-4H8v-2h4V6h2v4zm-9 0.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6z"}
        />
      </svg>
      {likes}
    </Button>
  );
};

export default ReviewLike;