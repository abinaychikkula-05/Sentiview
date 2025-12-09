/**
 * Utility Functions
 */

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'Positive':
      return '#4CAF50';
    case 'Negative':
      return '#f44336';
    case 'Neutral':
      return '#FFC107';
    default:
      return '#9E9E9E';
  }
};

export const getSentimentBgColor = (sentiment) => {
  switch (sentiment) {
    case 'Positive':
      return '#E8F5E9';
    case 'Negative':
      return '#FFEBEE';
    case 'Neutral':
      return '#FFF8E1';
    default:
      return '#F5F5F5';
  }
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getAPIUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Development (Localhost, Codespaces, Gitpod)
  // Use relative path to leverage package.json proxy
  if (
    hostname.includes('localhost') || 
    hostname.includes('127.0.0.1') || 
    hostname.includes('github.dev') || 
    hostname.includes('gitpod.io')
  ) {
    console.log('🔧 Using proxy for API requests');
    return '';
  }
  
  // Production
  return 'https://airy-tranquility-production-da57.up.railway.app';
};
