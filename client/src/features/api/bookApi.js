import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
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
        const { page = 1, limit = 9, search = '', sort = 'title', genre, featured } = params;
        const queryParams = {
          page,
          limit,
          search,
          sort,
          ...(genre && { genre }),
          ...(featured !== undefined && { featured })
        };
        return {
          url: '/books',
          params: queryParams
        };
      },
      transformResponse: (response) => ({
        books: response.books,
        page: response.page,
        pages: response.pages,
        total: response.total,
        limit: response.limit
      }),
      providesTags: ['Books']
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
      query: (params = {}) => ({
        url: '/books/featured',
        params: {
          page: params.page || 1,
          limit: params.limit || 6
        }
      }),
      transformResponse: (response) => ({
        books: response.books,
        page: response.page,
        pages: response.pages,
        total: response.total,
        limit: response.limit
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