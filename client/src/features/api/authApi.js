import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * API slice for handling user authentication operations
 * Uses RTK Query for efficient data fetching and caching
 */
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/auth',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register a new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Get user profile
    getUserProfile: builder.query({
      query: () => '/profile',
      providesTags: ['User'],
    }),
    
    // Update user profile
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = authApi;