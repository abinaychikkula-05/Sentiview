/**
 * Feedback API Service
 * Handles all feedback-related API calls
 */

import axios from 'axios';
import { getAPIUrl } from '../utils/helpers';

export const feedbackService = {
  // Upload CSV file
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${getAPIUrl()}/api/feedback/upload`, formData, {
      headers: {
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

    const response = await axios.get(`${getAPIUrl()}/api/feedback?${params.toString()}`);
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    const response = await axios.get(`${getAPIUrl()}/api/feedback/${id}`);
    return response.data;
  },

  // Get sentiment analytics
  getSentimentAnalytics: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`${getAPIUrl()}/api/feedback/analytics/summary?${params.toString()}`);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    const response = await axios.delete(`${getAPIUrl()}/api/feedback/${id}`);
    return response.data;
  },
};
