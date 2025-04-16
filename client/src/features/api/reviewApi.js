import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * API slice for handling review-related operations
 * Uses RTK Query for efficient data fetching and caching
 */
export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth?.userInfo?.token;
      
      // If token exists, add authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    // Get reviews for a book
    getReviews: builder.query({
      query: (bookId) => `/reviews?book=${bookId}`,
      providesTags: ['Review']
    }),
    
    // Create a new review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review']
    }),
    
    // Update an existing review
    updateReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        'Review',
      ]
    }),
    
    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review']
    }),
    
    // Like a review
    likeReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/like`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Review', id }]
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useLikeReviewMutation,
} = reviewApi;