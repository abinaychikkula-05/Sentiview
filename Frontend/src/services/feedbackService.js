/**
 * Feedback API Service
 * Handles all feedback-related API calls
 */

import axios from 'axios';
import { getAPIUrl } from '../utils/helpers';

// Pull JWT from localStorage right before each request so we never miss auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const token = window.localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (err) {
    console.warn('Unable to read auth token from storage:', err);
    return {};
  }
};

export const feedbackService = {
  // Upload CSV file
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${getAPIUrl()}/api/feedback/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add single feedback
  addFeedback: async (clientName, feedback, rating, category) => {
    const response = await axios.post(`${getAPIUrl()}/api/feedback`, {
      clientName,
      feedback,
      rating,
      category,
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get all feedback
  getAllFeedback: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    
    // Add timestamp to prevent caching
    params.append('_t', new Date().getTime());

    const response = await axios.get(`${getAPIUrl()}/api/feedback?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    const response = await axios.get(`${getAPIUrl()}/api/feedback/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get sentiment analytics
  getSentimentAnalytics: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`${getAPIUrl()}/api/feedback/analytics/summary?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    const response = await axios.delete(`${getAPIUrl()}/api/feedback/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
