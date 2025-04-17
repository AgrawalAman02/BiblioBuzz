import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";

const ReviewLike = ({ reviewId, initialLikes, onLike }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check if user has liked this review from localStorage
  useEffect(() => {
    const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
    setHasLiked(likedReviews.includes(reviewId));
  }, [reviewId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like reviews');
      return;
    }

    if (hasLiked) {
      return; // Prevent liking again
    }

    try {
      await onLike();
      // Save to localStorage
      const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
      localStorage.setItem('likedReviews', JSON.stringify([...likedReviews, reviewId]));
      setHasLiked(true);
    } catch (err) {
      console.error('Failed to like review:', err);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleLike}
      disabled={hasLiked}
      className={`flex items-center ${hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
      {initialLikes} {hasLiked ? 'Liked' : 'Like'}
    </Button>
  );
};

export default ReviewLike;