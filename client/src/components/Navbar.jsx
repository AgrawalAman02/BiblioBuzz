import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/features/api/authApi';
import { logout } from '@/features/auth/authSlice';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // RTK Query mutation hook
  const [logoutMutation] = useLogoutMutation();
  
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await logoutMutation().unwrap();
      // Update local state
      dispatch(logout());
      // Close mobile menu if open
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if API fails, we can still log out locally
      dispatch(logout());
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">BookReviews</Link>
          
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
            <li><Link to="/books" className="hover:text-blue-300">Books</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/profile" className="hover:text-blue-300">Profile</Link></li>
                <li><Link to="/my-reviews" className="hover:text-blue-300">My Reviews</Link></li>
                {userInfo?.isAdmin && (
                  <li>
                    <Link to="/admin/books" className="hover:text-blue-300">
                      Manage Books
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="secondary" asChild className="bg-blue-600 hover:bg-blue-800 text-white">
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="secondary" asChild className="bg-green-600 hover:bg-green-800 text-white">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            ) : (
              <>
                <span className="flex items-center mr-4">
                  Welcome, {userInfo?.username || 'User'}
                  {userInfo?.isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <Button 
                  variant="secondary" 
                  className="bg-red-600 hover:bg-red-800 text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">BookReviews</Link>
          
          <button 
            className="text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link to="/" className="block py-2 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="block py-2 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                  Books
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/profile" className="block py-2 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-reviews" className="block py-2 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                      My Reviews
                    </Link>
                  </li>
                  {userInfo?.isAdmin && (
                    <li>
                      <Link to="/admin/books" className="block py-2 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                        Manage Books
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            
            <div className="pt-4 border-t border-blue-600">
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="secondary" 
                    asChild 
                    className="bg-blue-600 hover:bg-blue-800 text-white w-full"
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    asChild 
                    className="bg-green-600 hover:bg-green-800 text-white w-full"
                  >
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="py-2 flex items-center">
                    Welcome, {userInfo?.username || 'User'}
                    {userInfo?.isAdmin && (
                      <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="secondary" 
                    className="bg-red-600 hover:bg-red-800 text-white w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;