/**
 * Authentication Context
 * Manages user authentication state globally
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { getAPIUrl } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    // Set CORS credentials to include
    // axios.defaults.withCredentials = true; // Disabled to prevent CORS issues on strict networks
    console.log('✅ Axios configured');
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
  }, [token, user]);

  const register = async (username, email, password, company) => {
    setLoading(true);
    try {
      const apiUrl = getAPIUrl();
      console.log('🔄 Registering with URL:', apiUrl);
      
      const registerUrl = `${apiUrl}/api/auth/register`;
      console.log('📍 Full URL:', registerUrl);
      console.log('📤 Sending POST request using fetch...');
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        // mode: 'cors', // Removed explicit mode to let browser handle it naturally
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': 'application/json', // Removed to simplify headers
        },
        body: JSON.stringify({
          username,
          email,
          password,
          company,
        }),
      });
      
      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('✅ Registration successful:', data);
      
      if (!response.ok) {
        throw data || { message: 'Registration failed' };
      }
      
      // Set token immediately for subsequent requests
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('❌ Register error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error details:', {
        message: error.message || error?.message,
        data: error,
      });
      
      const err = new Error(error.message || 'Registration failed');
      throw err;
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
      console.log('📤 Sending POST request using fetch...');
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        // mode: 'cors', // Removed explicit mode
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': 'application/json', // Removed
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('✅ Login successful:', data);
      
      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }
      
      // Set token immediately for subsequent requests
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error details:', {
        message: error.message || error?.message,
        data: error,
      });
      
      if (error instanceof Error) {
        throw error;
      } else if (error?.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed');
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
      const err = new Error(error.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await axios.post(`${getAPIUrl()}/api/auth/reset-password`, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      const err = new Error(error.response?.data?.message || 'Failed to reset password');
      throw err;
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
    resetPassword,
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
