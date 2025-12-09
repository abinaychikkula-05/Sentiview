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

  // Always use relative path - Backend is deployed on same Vercel domain
  // In dev: uses package.json proxy to localhost:5000
  // In production: uses Vercel rewrites to Backend/index.js
  console.log('🔧 Using relative path for API (same-origin)');
  return '';
};
};
