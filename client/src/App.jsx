import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGetMeQuery } from '@/features/api/authApi';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Check authentication status when app loads
  // Skip if no user info in local storage to avoid unnecessary requests
  const { isLoading } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('userInfo')
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[80vh]">
              <div className="text-center">
                <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2">Loading...</p>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes that require authentication */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="py-8">Profile page (to be implemented)</div>
                </ProtectedRoute>
              } />
              <Route path="/my-reviews" element={
                <ProtectedRoute>
                  <div className="py-8">My Reviews page (to be implemented)</div>
                </ProtectedRoute>
              } />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
