import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookForm from './BookForm';
import { useGetBooksQuery, useDeleteBookMutation, useUpdateBookMutation, useAddBookMutation } from '@/features/api/bookApi';

const AdminBookList = () => {
  const [editingBook, setEditingBook] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  
  // RTK Query hooks
  const { data, isLoading } = useGetBooksQuery({});
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
    return <div>Loading...</div>;
  }

  if (isAddingBook) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setIsAddingBook(false)}>← Back to Book List</Button>
        <BookForm onSubmit={handleAdd} />
      </div>
    );
  }

  if (editingBook) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setEditingBook(null)}>← Back to Book List</Button>
        <BookForm initialData={editingBook} onSubmit={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Books</h2>
        <Button onClick={() => setIsAddingBook(true)}>Add New Book</Button>
      </div>

      <div className="grid gap-4">
        {data?.books?.map((book) => (
          <Card key={book._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{book.title}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingBook(book)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>ISBN:</strong> {book.isbn}</p>
                  <p><strong>Publisher:</strong> {book.publisher}</p>
                  <p><strong>Year:</strong> {book.publicationYear}</p>
                </div>
                <div>
                  <p><strong>Genre:</strong> {book.genre.join(', ')}</p>
                  <p><strong>Rating:</strong> {book.averageRating} ({book.reviewCount} reviews)</p>
                  <p><strong>Featured:</strong> {book.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBookList;