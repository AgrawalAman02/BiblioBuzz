import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookForm from './BookForm';
import { useGetBooksQuery, useDeleteBookMutation, useUpdateBookMutation, useAddBookMutation } from '@/features/api/bookApi';

const AdminBookList = () => {
  const [editingBook, setEditingBook] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading } = useGetBooksQuery({ 
    page: currentPage,
    limit: 9
  });

  const [deleteBook] = useDeleteBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [addBook] = useAddBookMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id).unwrap();
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateBook({
        id: editingBook._id,
        ...data
      }).unwrap();
      setEditingBook(null);
    } catch (err) {
      console.error('Failed to update book:', err);
    }
  };

  const handleAdd = async (data) => {
    try {
      await addBook(data).unwrap();
      setIsAddingBook(false);
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAddingBook) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          onClick={() => setIsAddingBook(false)} 
          className="mb-6"
          variant="outline"
        >
          ← Back to Book List
        </Button>
        <BookForm onSubmit={handleAdd} />
      </div>
    );
  }

  if (editingBook) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          onClick={() => setEditingBook(null)} 
          className="mb-6"
          variant="outline"
        >
          ← Back to Book List
        </Button>
        <BookForm initialData={editingBook} onSubmit={handleUpdate} />
      </div>
    );
  }

  const totalPages = data?.pages || 1;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">Manage Books</h2>
        <Button onClick={() => setIsAddingBook(true)} size="lg">
          Add New Book
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        {data?.books?.map((book) => (
          <Card key={book._id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-xl">{book.title}</CardTitle>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingBook(book)}
                    className="flex-1 md:flex-none"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 md:flex-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><span className="font-semibold">Author:</span> {book.author}</p>
                  <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                  <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                  <p><span className="font-semibold">Year:</span> {book.publicationYear}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold">Genre:</span> {book.genre.join(', ')}</p>
                  <p>
                    <span className="font-semibold">Rating:</span> 
                    <span className="ml-1">
                      {book.averageRating} ({book.reviewCount} reviews)
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Featured:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      book.featured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.featured ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminBookList;