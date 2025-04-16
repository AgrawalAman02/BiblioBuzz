import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFeaturedBooksQuery } from '@/features/api/bookApi';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  // Fetch featured books from the API
  const { data: featuredBooks, error, isLoading } = useGetFeaturedBooksQuery();

  return (
    <div className="py-8">
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Books</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load featured books. Please try again later.</p>
            <p className="text-sm mt-2">{error.message || 'Unknown error'}</p>
          </div>
        ) : featuredBooks?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No featured books available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks?.map((book) => (
              <Card key={book._id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{book.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{book.averageRating}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/books/${book._id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;