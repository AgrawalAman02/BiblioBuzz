import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserReviewsQuery } from '@/features/api/reviewApi';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const UserStats = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: userReviews, isLoading } = useGetUserReviewsQuery();
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    mostReviewedGenres: []
  });
  
  useEffect(() => {
    if (userReviews) {
      // Calculate statistics
      const totalReviews = userReviews.length;
      const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
      
      // Calculate genre statistics
      const genreCounts = {};
      userReviews.forEach(review => {
        if (review.book && review.book.genre) {
          review.book.genre.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });
      
      // Sort genres by count
      const mostReviewedGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre, count]) => ({ genre, count }));
      
      setStats({
        totalReviews,
        averageRating,
        mostReviewedGenres
      });
    }
  }, [userReviews]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Review Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Reviews</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalReviews}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Average Rating</h3>
            <p className="text-3xl font-bold text-green-600">{stats.averageRating} / 5</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Most Reviewed Genres</h3>
            <ul className="mt-2 space-y-1">
              {stats.mostReviewedGenres.map(({ genre, count }) => (
                <li key={genre} className="text-purple-600">
                  {genre} <span className="text-purple-400">({count})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;