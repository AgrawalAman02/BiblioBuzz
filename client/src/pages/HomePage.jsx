import React from 'react';

const HomePage = () => {
  // Mock featured books data (will be replaced with API call later)
  const featuredBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1000&auto=format&fit=crop',
      rating: 4.6
    }
  ];

  return (
    <div className="py-8">
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{book.rating}</span>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;