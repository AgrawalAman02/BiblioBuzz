import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Add required content type
      headers.set('Content-Type', 'application/json');
      
      // Get token from localStorage
      const token = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')).token 
        : null;
      
      // If token exists, add authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  tagTypes: ['Review', 'Reviews'],
  endpoints: (builder) => ({
    // Get reviews for a specific book
    getReviews: builder.query({
      query: (bookId) => ({
        url: '/reviews',
        params: { book: bookId },
      }),
      providesTags: ['Reviews'],
    }),
    
    // Create a new review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews'],
    }),
    
    // Update a review
    updateReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews'],
    }),
    
    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
    
    // Like a review
    likeReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/like`,
        method: 'PUT',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useLikeReviewMutation,
} = reviewApi;