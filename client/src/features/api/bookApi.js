import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Include cookies with every request
    prepareHeaders: (headers) => {
      // Set content type
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Book', 'Books'],
  endpoints: (builder) => ({
    // Get all books with pagination
    getBooks: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', ...rest } = params;
        return {
          url: '/books',
          params: { page, limit, search, ...rest },
        };
      },
      providesTags: ['Books'],
    }),
    
    // Get a single book by ID
    getBook: builder.query({
      query: (bookId) => ({
        url: `/books/${bookId}`,
      }),
      providesTags: (result, error, bookId) => [{ type: 'Book', id: bookId }],
    }),
    
    // Add a new book (admin only)
    addBook: builder.mutation({
      query: (bookData) => ({
        url: '/books',
        method: 'POST',
        body: bookData,
      }),
      invalidatesTags: ['Books'],
    }),
    
    // Update a book (admin only)
    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: bookData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Book', id },
        'Books',
      ],
    }),
    
    // Delete a book (admin only)
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
    
    // Get featured books
    getFeaturedBooks: builder.query({
      query: () => ({
        url: '/books/featured',
      }),
      providesTags: ['Books'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useGetFeaturedBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;