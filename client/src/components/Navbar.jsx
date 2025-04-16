import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/features/api/authApi';
import { logout } from '@/features/auth/authSlice';
import { Button } from "@/components/ui/button";

const Navbar = () => {
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
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if API fails, we can still log out locally
      dispatch(logout());
    }
  };

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">BookReviews</Link>
        
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
          <li><Link to="/books" className="hover:text-blue-300">Books</Link></li>
          {isAuthenticated && (
            <li><Link to="/profile" className="hover:text-blue-300">Profile</Link></li>
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
                Welcome, {userInfo?.username || 'User'}!
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
    </nav>
  );
};

export default Navbar;