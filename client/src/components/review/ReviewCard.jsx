import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewLike from './ReviewLike';

const ReviewCard = ({ 
  review, 
  onDelete,
  onLike,
  showBookInfo = false,
  showEditButton = false,
  onEdit
}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const canEdit = review.user?._id === userInfo?._id;
  const canDelete = userInfo?.isAdmin || canEdit;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{review.title}</CardTitle>
            {showBookInfo && (
              <p className="text-gray-600">
                Review for: {review.book?.title} by {review.book?.author}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  {i < review.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(review._id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          By {review.user?.username || 'Anonymous'} on {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700">{review.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <ReviewLike 
          reviewId={review._id}
          initialLikes={review.likes}
          onLike={() => onLike(review._id)}
        />
        {showEditButton && canEdit && (
          <Button variant="outline" onClick={() => onEdit(review._id)}>
            Edit Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;