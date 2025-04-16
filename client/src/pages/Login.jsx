import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLoginMutation } from '@/features/api/authApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // RTK Query mutation hook
  const [login, { isLoading, error }] = useLoginMutation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Call login mutation with credentials
      await login({ email, password }).unwrap();
      navigate('/');
    } catch (err) {
      // Error handling is managed by RTK Query
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error.data?.message || 'Failed to login. Please check your credentials.'}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;