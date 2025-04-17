import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUpdateProfileMutation } from '@/features/api/authApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // RTK Query mutation hook
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Load user data into form
  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Reset status messages
    setMessage(null);
    setUpdateSuccess(false);

    // Basic validation
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      // Create request body - only include password if provided
      const requestBody = {
        username,
        email,
        ...(password ? { password } : {})
      };

      // Call the updateProfile mutation
      await updateProfile(requestBody).unwrap();
      
      setUpdateSuccess(true);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.data?.message || 'Failed to update profile' });
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        </CardHeader>

        <CardContent>
          {message && (
            <div className={`p-4 mb-4 rounded-md ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}

          {updateSuccess && (
            <div className="p-4 mb-4 rounded-md bg-green-50 text-green-700">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password (leave blank to keep current)
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                disabled={!formData.password}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <span>Reviews written:</span>
            <span className="font-semibold">{userInfo?.reviewCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Account created:</span>
            <span className="font-semibold">
              {userInfo?.createdAt 
                ? new Date(userInfo.createdAt).toLocaleDateString() 
                : 'Unknown'}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/my-reviews">View My Reviews</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;