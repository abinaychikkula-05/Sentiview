/**
 * Main Server File
 * SentiView: Client Feedback Analysis and Sentiment Dashboard
 * v2.0 - CORS preflight fix deployed
 */

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to database
// connectDB();

const app = express();

// CORS configuration - MUST be FIRST before any other middleware
const allowedOrigins = [
  'https://sentiview-ten.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('📍 CORS allowed origins:', allowedOrigins);

app.use((req, res, next) => {
  const origin = req.get('origin');
  
  // Allow all Vercel deployments, localhost, and GitHub Codespaces
  const isAllowedOrigin = !origin || 
    allowedOrigins.includes(origin) || 
    origin.endsWith('.vercel.app') ||
    origin.includes('github.dev') ||
    origin.includes('githubusercontent.com') ||
    origin.includes('localhost');

  console.log(`🔍 CORS Check: Origin=${origin}, Allowed=${isAllowedOrigin}`);

  if (origin && isAllowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    // Always respond 204 to OPTIONS if origin is allowed
    if (isAllowedOrigin) {
      return res.sendStatus(204);
    }
    // If not allowed, we still might want to return 204 but without the Allow-Origin header
    // to prevent browser errors, but standard is 403. 
    // Let's stick to 204 but without the header if we want to be silent, 
    // or 403 if we want to be strict. 
    // Given the user's issue, let's be strict on 403 only if we are SURE it's bad.
  }

  if (!isAllowedOrigin) {
    console.warn('🚫 CORS blocked origin:', origin);
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }

  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Disable caching for API responses to ensure real-time data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
  
  // Set timeout for requests
  req.setTimeout(30000); // 30 seconds
  
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SentiView API is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`SentiView API running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});
