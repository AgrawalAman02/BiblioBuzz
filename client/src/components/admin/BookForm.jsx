import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || '',
    genre: initialData?.genre?.join(', ') || '',
    publicationYear: initialData?.publicationYear || new Date().getFullYear(),
    publisher: initialData?.publisher || '',
    isbn: initialData?.isbn || '',
    featured: initialData?.featured || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert genre string to array and trim whitespace
    const formattedData = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
      publicationYear: parseInt(formData.publicationYear)
    };
    onSubmit(formattedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Book' : 'Add New Book'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <Input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Genre (comma-separated)</label>
            <Input
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              placeholder="Fiction, Fantasy, Adventure"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Publication Year</label>
              <Input
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ISBN</label>
              <Input
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Publisher</label>
            <Input
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured Book
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookForm;