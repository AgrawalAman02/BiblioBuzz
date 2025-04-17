import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/features/api/authApi';
import { logout } from '@/features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const [logoutMutation] = useLogoutMutation();
  
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout());
    }
  };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Books' },
    ...(isAuthenticated ? [
      { to: '/profile', label: 'Profile' },
      { to: '/my-reviews', label: 'My Reviews' },
      ...(userInfo?.isAdmin ? [{ to: '/admin/books', label: 'Manage Books' }] : [])
    ] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
            BiblioBuzz
          </Link>
          
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    "px-4 py-2 rounded-md transition-colors relative",
                    "hover:bg-blue-600 hover:text-white",
                    isActive ? "bg-blue-800 text-white" : "text-blue-100"
                  )}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center space-x-4">
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
                <span className="flex items-center">
                  Welcome, {userInfo?.username || 'User'}
                  {userInfo?.isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded-full text-black">
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
        <div className="md:hidden flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold">BiblioBuzz</Link>
          
          <button 
            className="p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "block px-4 py-2 rounded-md transition-colors",
                  "hover:bg-blue-600",
                  isActive ? "bg-blue-800 text-white" : "text-blue-100"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            
            <div className="pt-4 border-t border-blue-600 mt-4">
              {!isAuthenticated ? (
                <div className="space-y-2 px-4">
                  <Button 
                    variant="secondary" 
                    asChild 
                    className="w-full bg-blue-600 hover:bg-blue-800 text-white"
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-800 text-white"
                  >
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  <div className="py-2 flex items-center">
                    Welcome, {userInfo?.username || 'User'}
                    {userInfo?.isAdmin && (
                      <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded-full text-black">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-red-600 hover:bg-red-800 text-white"
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