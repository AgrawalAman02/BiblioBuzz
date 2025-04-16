import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BookDetail = () => {
  const { id } = useParams();
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  
  // Mock book data (will be replaced with API call later)
  const book = {
    id: parseInt(id),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    genre: ['Classic', 'Fiction'],
    publicationYear: 1960,
    publisher: 'J. B. Lippincott & Co.',
    isbn: '978-0-06-112008-4',
    description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on the author\'s observations of her family, her neighbors and an event that occurred near her hometown in 1936, when she was 10 years old. The novel is renowned for its warmth and humor, despite dealing with serious issues of rape and racial inequality.',
    reviews: [
      {
        id: 1,
        user: 'Alice Johnson',
        rating: 5,
        title: 'A timeless classic',
        content: 'This book changed my perspective on so many things. The characters are unforgettable and the story is as relevant today as it was when it was written.',
        date: '2023-10-15',
        likes: 24
      },
      {
        id: 2,
        user: 'Bob Smith',
        rating: 4,
        title: 'Powerful story, still resonates',
        content: 'Lee\'s writing is simply beautiful. The way she portrays the innocence of childhood against the backdrop of serious social issues is masterful.',
        date: '2024-01-03',
        likes: 17
      },
      {
        id: 3,
        user: 'Carol Davis',
        rating: 5,
        title: 'Required reading for everyone',
        content: 'I re-read this every few years and always find something new to appreciate. A profound exploration of human nature and morality.',
        date: '2024-03-22',
        likes: 8
      }
    ]
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // This would be an API call in a real application
    console.log('Review submitted:', reviewForm);
    // Reset form
    setReviewForm({ rating: 5, title: '', content: '' });
    alert('Review submitted successfully!');
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-1 mr-2">{book.rating}</span>
              </div>
              <div className="text-gray-500">({book.reviews.length} reviews)</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genre.map(g => (
                <span key={g} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="font-semibold">Published:</span> {book.publicationYear}
              </div>
              <div>
                <span className="font-semibold">Publisher:</span> {book.publisher}
              </div>
              <div>
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>
            
            <Button>Add to Reading List</Button>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {/* Review Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    name="title"
                    value={reviewForm.title}
                    onChange={handleReviewChange}
                    placeholder="Summarize your review"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <textarea
                    name="content"
                    value={reviewForm.content}
                    onChange={handleReviewChange}
                    placeholder="Share your thoughts about this book"
                    required
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <Button type="submit">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Reviews List */}
          {book.reviews.map(review => (
            <Card key={review.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  By {review.user} on {review.date}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.content}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-sm text-gray-500">
                  <button className="flex items-center hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {review.likes} likes
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;