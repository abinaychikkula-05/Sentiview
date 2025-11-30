/**
 * Authentication Context
 * Manages user authentication state globally
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Determine API URL based on environment
const getAPIUrl = () => {
  // First check if explicitly set in environment (build-time variable)
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Runtime detection for production Vercel deployment
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  console.log('Current hostname:', hostname);
  
  if (hostname.includes('vercel.app')) {
    console.log('Detected Vercel deployment, using Railway backend');
    return 'https://airy-tranquility-production-da57.up.railway.app';
  }
  
  // Default for local development
  return 'http://localhost:5000';
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    // Set CORS credentials to include
    axios.defaults.withCredentials = true;
    console.log('✅ Axios configured with CORS credentials');
  }, []);

  // Set default axios header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Restore user session if token exists but user is missing
      if (!user) {
        setLoading(true);
        axios.get(`${getAPIUrl()}/api/auth/me`)
          .then((response) => {
            setUser(response.data.user);
          })
          .catch(() => {
            setToken(null);
            setUser(null);
          })
          .finally(() => setLoading(false));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const register = async (username, email, password, company) => {
    setLoading(true);
    try {
      const apiUrl = getAPIUrl();
      console.log('🔄 Registering with URL:', apiUrl);
      
      const registerUrl = `${apiUrl}/api/auth/register`;
      console.log('📍 Full URL:', registerUrl);
      console.log('📤 Sending POST request...');
      
      const response = await axios.post(registerUrl, {
        username,
        email,
        password,
        company,
      });
      console.log('✅ Registration successful:', response.data);
      
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, error };
      } else {
        throw { message: 'Network error or server unreachable', error };
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const apiUrl = getAPIUrl();
      console.log('🔄 Logging in with URL:', apiUrl);
      console.log('📧 Email:', email);
      
      const loginUrl = `${apiUrl}/api/auth/login`;
      console.log('📍 Full URL:', loginUrl);
      console.log('📤 Sending POST request...');
      
      // Add timeout to axios request
      const response = await axios.post(loginUrl, {
        email,
        password,
      }, {
        timeout: 10000, // 10 second timeout
      });
      
      console.log('✅ Login successful:', response.data);
      
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        isAxiosError: error.isAxiosError,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, error };
      } else {
        throw { message: 'Network error or server unreachable', error };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const response = await axios.put(`${getAPIUrl()}/api/users/me`, updates);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
