import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '@/features/auth/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Include cookies with every request
    prepareHeaders: (headers, { getState }) => {
      // Add required content type
      headers.set('Content-Type', 'application/json');
      
      // Get token from localStorage or state
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register a new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Handle errors if needed
        }
      },
    }),
    
    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Handle errors if needed
        }
      },
    }),
    
    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          // Handle errors if needed
        }
      },
    }),
    
    // Get current user profile
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // If unauthorized, log out user locally
          if (err.error?.status === 401) {
            dispatch(logout());
          }
        }
      }
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;