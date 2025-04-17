import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGetMeQuery } from '@/features/api/authApi';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import AdminBookList from './components/admin/BookList';
import HomePage from './pages/HomePage';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import MyReviews from './pages/MyReviews';
import EditReview from './pages/EditReview';

function App() {
  // Always check authentication status when app loads
  // We want to check even if no userInfo in localStorage because the cookie might still be valid
  const { isLoading } = useGetMeQuery();

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
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/my-reviews" element={
                <ProtectedRoute>
                  <MyReviews />
                </ProtectedRoute>
              } />
              <Route path="/reviews/edit/:id" element={
                <ProtectedRoute>
                  <EditReview />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin/books" element={
                <AdminRoute>
                  <AdminBookList />
                </AdminRoute>
              } />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
