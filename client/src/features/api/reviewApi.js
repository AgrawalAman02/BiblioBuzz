import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Include cookies with every request
    prepareHeaders: (headers) => {
      // Set content type
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Review', 'Reviews', 'UserReviews'],
  endpoints: (builder) => ({
    // Get reviews for a specific book
    getReviewsByBook: builder.query({
      query: ({ bookId, page = 1, limit = 10 }) => ({
        url: `/reviews/book/${bookId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) => 
        result
          ? [...result.reviews.map(({ _id }) => ({ type: 'Review', id: _id })), 'Reviews']
          : ['Reviews'],
    }),

    // Get all reviews for a book
    getReviews: builder.query({
      query: (bookId) => ({
        url: '/reviews',
        params: { book: bookId }
      }),
      providesTags: (result) => 
        result
          ? [...result.map(({ _id }) => ({ type: 'Review', id: _id })), 'Reviews']
          : ['Reviews'],
    }),

    // Get reviews by current user
    getUserReviews: builder.query({
      query: () => ({
        url: '/reviews/user',
      }),
      providesTags: ['UserReviews'],
    }),
    
    // Get a single review by ID
    getReviewById: builder.query({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    
    // Create a new review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews', 'UserReviews'],
    }),
    
    // Update a review
    updateReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews', 'UserReviews'],
    }),
    
    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews', 'UserReviews'],
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
  useGetReviewsByBookQuery,
  useGetReviewsQuery,
  useGetUserReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useLikeReviewMutation,
} = reviewApi;