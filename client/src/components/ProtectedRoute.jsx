import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMeQuery } from '@/features/api/authApi';

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading, isError } = useGetMeQuery(undefined, {
    skip: false, // Never skip this query in protected routes
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if there's an error or not authenticated
  if (isError || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;