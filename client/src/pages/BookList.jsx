import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const BookList = () => {
  // Mock books data (will be replaced with API call later)
  const allBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5,
      genre: ['Classic', 'Fiction'],
      publicationYear: 1925
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
      rating: 4.8,
      genre: ['Classic', 'Fiction'],
      publicationYear: 1960
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1000&auto=format&fit=crop',
      rating: 4.6,
      genre: ['Dystopian', 'Science Fiction'],
      publicationYear: 1949
    },
    {
      id: 4,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000&auto=format&fit=crop',
      rating: 4.7,
      genre: ['Fantasy', 'Fiction'],
      publicationYear: 1937
    },
    {
      id: 5,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5,
      genre: ['Classic', 'Romance'],
      publicationYear: 1813
    },
    {
      id: 6,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000&auto=format&fit=crop',
      rating: 4.2,
      genre: ['Classic', 'Fiction'],
      publicationYear: 1951
    }
  ];

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortBy, setSortBy] = useState('title'); // title, author, rating, year

  // Get unique genres for filter dropdown
  const allGenres = [...new Set(allBooks.flatMap(book => book.genre))];
  
  // Filter and sort books
  const filteredBooks = allBooks
    .filter(book => {
      // Search filter
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Genre filter
      const matchesGenre = genreFilter === '' || book.genre.includes(genreFilter);
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      // Sort based on selected criteria
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'rating':
          return b.rating - a.rating; // Higher ratings first
        case 'year':
          return b.publicationYear - a.publicationYear; // Newer books first
        default:
          return 0;
      }
    });

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse Books</h2>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">All Genres</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
              <option value="year">Publication Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author} • {book.publicationYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{book.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.genre.map(g => (
                    <span key={g} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/books/${book.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;