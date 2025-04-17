import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Authentication utility functions
 */
import { getCookie } from './cookie';

/**
 * Get the authentication token from all available sources
 * Tries Redux store, cookies, and localStorage in that order
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  let token = null;
  
  // Try to get from cookies first
  token = getCookie('authToken');
  if (token) return token;
  
  // Try to get from localStorage
  try {
    const userInfoFromStorage = localStorage.getItem('userInfo');
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      token = parsedUserInfo.token;
      if (token) return token;
    }
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
  }
  
  return null;
};

/**
 * Check if user is authenticated by verifying token existence
 * @returns {boolean} Whether user is authenticated
 */
export const isUserAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Prepare authorization headers for API requests
 * @returns {Object} Headers object with Authorization if token exists
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
