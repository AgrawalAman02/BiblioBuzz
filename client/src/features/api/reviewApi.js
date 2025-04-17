import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Review', 'Reviews', 'UserReviews'],
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
      providesTags: ['UserReviews'],
    }),

    // Create a review
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reviews', 'UserReviews'],
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
        'UserReviews'
      ],
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
      invalidatesTags: (result, error, id) => [{ type: 'Review', id }, 'Reviews'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            reviewApi.util.updateQueryData('getReviews', undefined, (draft) => {
              const review = draft.find((r) => r._id === id);
              if (review) {
                review.likes = data.likes;
                review.hasLiked = true;
              }
            })
          );
        } catch {}
      },
    }),

    // Unlike a review
    unlikeReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/unlike`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Review', id }, 'Reviews'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            reviewApi.util.updateQueryData('getReviews', undefined, (draft) => {
              const review = draft.find((r) => r._id === id);
              if (review) {
                review.likes = data.likes;
                review.hasLiked = false;
              }
            })
          );
        } catch {}
      },
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
  useUnlikeReviewMutation,
} = reviewApi;