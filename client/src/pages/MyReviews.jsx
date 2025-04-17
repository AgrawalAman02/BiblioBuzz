import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetReviewsQuery, useDeleteReviewMutation } from '@/features/api/reviewApi';

const MyReviews = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Get all reviews if admin, otherwise get user's reviews
  const { data: reviews, isLoading, error: fetchError } = useGetReviewsQuery(undefined, {
    skip: !isAuthenticated,
    onError: (error) => {
      if (error?.status === 401) {
        navigate('/login');
      }
    }
  });
  
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  
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
      
      {reviews?.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews found.</p>
          <Button asChild>
            <Link to="/books">Browse Books to Review</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews?.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{review.book.title}</CardTitle>
                    <p className="text-gray-500">By {review.book.author}</p>
                    {userInfo?.isAdmin && (
                      <p className="text-sm text-gray-500 mt-1">
                        Reviewed by: {review.user?.username}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <h3 className="font-semibold mb-2">{review.title}</h3>
                <p className="text-gray-700">{review.content}</p>
                <div className="text-sm text-gray-500 mt-4">
                  Posted on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/books/${review.book._id}`}>View Book</Link>
                </Button>
                <div>
                  {/* Show edit button only to review owner */}
                  {review.user?._id === userInfo?._id && (
                    <Button 
                      variant="outline" 
                      className="mr-2" 
                      asChild
                    >
                      <Link to={`/reviews/edit/${review._id}`}>Edit</Link>
                    </Button>
                  )}
                  {/* Show delete button to admin or review owner */}
                  {(userInfo?.isAdmin || review.user?._id === userInfo?._id) && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;