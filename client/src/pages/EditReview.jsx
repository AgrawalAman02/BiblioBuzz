import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetReviewQuery, useUpdateReviewMutation } from '@/features/api/reviewApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useSelector(state => state.auth);
  
  // Use RTK Query to fetch the review data
  const { data: review, error: fetchError, isLoading: isFetching } = useGetReviewQuery(id, {
    skip: !isAuthenticated
  });
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  
  const [error, setError] = useState(null);
  
  // RTK Query mutation
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  
  // Check authentication first
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Set form data when review is loaded
  useEffect(() => {
    if (review) {
      // Check if this review belongs to the current user
      if (review.user._id !== userInfo?._id && !userInfo?.isAdmin) {
        setError('You are not authorized to edit this review');
        return;
      }
      
      setReviewData({
        rating: review.rating,
        title: review.title,
        content: review.content
      });
    }
  }, [review, userInfo]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateReview({
        id,
        ...reviewData
      }).unwrap();
      
      // Redirect back to the book page or my-reviews page
      navigate('/my-reviews');
    } catch (err) {
      setError(err.data?.message || 'Failed to update review');
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading review...</p>
        </div>
      </div>
    );
  }
  
  if (fetchError || error) {
    return (
      <div className="py-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              <p>{fetchError?.data?.message || error || 'Error loading review'}</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/my-reviews')}
              >
                Back to My Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Your Review</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                name="rating"
                value={reviewData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review Title</label>
              <Input
                name="title"
                value={reviewData.title}
                onChange={handleChange}
                placeholder="Review title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Review Content</label>
              <textarea
                name="content"
                value={reviewData.content}
                onChange={handleChange}
                placeholder="Share your thoughts about this book"
                required
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/my-reviews')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditReview;