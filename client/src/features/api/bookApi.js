import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * API slice for handling book-related operations
 * Uses RTK Query for efficient data fetching and caching
 */
export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    // Get all books with optional filtering
    getBooks: builder.query({
      query: (params = {}) => {
        const { 
          search = '', 
          genre = '', 
          sort = 'title', 
          page = 1, 
          limit = 12 
        } = params;
        
        // Build query string with parameters
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (genre) queryParams.append('genre', genre);
        if (sort) queryParams.append('sort', sort);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        
        return {
          url: `/books?${queryParams.toString()}`
        };
      },
      providesTags: ['Book']
    }),
    
    // Get a specific book by ID
    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }]
    }),
    
    // Get featured books
    getFeaturedBooks: builder.query({
      query: () => `/books/featured`,
      providesTags: ['Book']
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetFeaturedBooksQuery,
} = bookApi;