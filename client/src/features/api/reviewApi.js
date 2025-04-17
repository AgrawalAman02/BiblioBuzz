import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Review', 'Reviews'],
  endpoints: (builder) => ({
    // Get reviews for a specific book
    getReviews: builder.query({
      query: (bookId) => ({
        url: '/reviews',
        params: bookId ? { book: bookId } : undefined
      }),
      providesTags: ['Reviews'],
    }),

    // Get a specific review
    getReview: builder.query({
      query: (id) => `/reviews/${id}`,
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),

    // Get user's reviews
    getUserReviews: builder.query({
      query: () => '/reviews/user',
      providesTags: ['Reviews'],
    }),

    // Create a review
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Update a review
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        'Reviews',
      ],
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
      invalidatesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useLikeReviewMutation,
} = reviewApi;