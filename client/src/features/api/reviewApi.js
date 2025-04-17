import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/lib/cookie';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      const token = getCookie('jwt');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (bookId) => ({
        url: '/reviews',
        params: bookId ? { book: bookId } : undefined,
      }),
      providesTags: ['Reviews'],
    }),
    getUserReviews: builder.query({
      query: () => '/reviews/user',
      providesTags: ['Reviews'],
    }),
    getReview: builder.query({
      query: (id) => `/reviews/${id}`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reviews'],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
    likeReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/like`,
        method: 'PUT',
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const result = await queryFulfilled;
          // Update all queries that include this review
          const updateQueries = ['getReviews', 'getUserReviews'];
          updateQueries.forEach(queryName => {
            dispatch(
              reviewApi.util.updateQueryData(queryName, undefined, (draft) => {
                const review = draft?.find(r => r._id === id);
                if (review) {
                  review.likes = result.data.likes;
                  review.hasLiked = result.data.hasLiked;
                }
              })
            );
          });
        } catch {
          // If the mutation fails, the cache will be rolled back automatically
        }
      },
    }),
    unlikeReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/unlike`,
        method: 'PUT',
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const result = await queryFulfilled;
          // Update all queries that include this review
          const updateQueries = ['getReviews', 'getUserReviews'];
          updateQueries.forEach(queryName => {
            dispatch(
              reviewApi.util.updateQueryData(queryName, undefined, (draft) => {
                const review = draft?.find(r => r._id === id);
                if (review) {
                  review.likes = result.data.likes;
                  review.hasLiked = result.data.hasLiked;
                }
              })
            );
          });
        } catch {
          // If the mutation fails, the cache will be rolled back automatically
        }
      },
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetUserReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useLikeReviewMutation,
  useUnlikeReviewMutation,
} = reviewApi;