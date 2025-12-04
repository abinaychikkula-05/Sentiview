/**
 * Main Server File
 * SentiView: Client Feedback Analysis and Sentiment Dashboard
 * v2.0 - CORS preflight fix deployed
 */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
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
  const isAllowedOrigin = (() => {
    if (!origin) return true; // allow non-browser requests (e.g., curl)
    if (allowedOrigins.includes(origin)) return true;
    // Allow any vercel deployment for convenience (production frontend is hosted on Vercel)
    if (origin.endsWith('.vercel.app') || origin.includes('.vercel.app')) return true;
    if (origin.includes('github.dev') || origin.includes('githubusercontent.com')) return true;
    if (origin.includes('localhost')) return true;
    // Also allow explicit FRONTEND_URL env var
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;
    return false;
  })();

  console.log(`🔍 CORS Check: Origin=${origin || 'none'}, Allowed=${isAllowedOrigin}`);

  // If the origin is allowed, echo it back explicitly.
  if (origin && isAllowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin && process.env.NODE_ENV !== 'production') {
    // Development fallback
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Respond immediately to preflight requests for allowed origins
app.use(compression());

// Parse JSON/urlencoded
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  if (req.method === 'OPTIONS') {
    if (isAllowedOrigin) {
      console.log('✅ CORS preflight OK for origin:', origin);
      return res.sendStatus(204);
    }
    console.warn('🚫 CORS preflight blocked for origin:', origin, 'headers:', req.headers);
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
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

// Debug endpoint - echoes headers and basic timing info
app.get('/api/debug/echo', (req, res) => {
  const info = {
    origin: req.get('origin') || null,
    host: req.get('host'),
    headers: req.headers,
    time: new Date().toISOString(),
  };

  res.json({ success: true, info });
});
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
  
  // Set timeout for requests
  req.setTimeout(30000); // 30 seconds
  
  // Log response info on finish for debugging CORS issues seen by browsers
  res.on('finish', () => {
    try {
      const acaOrigin = res.getHeader('Access-Control-Allow-Origin');
      console.log(`📤 Response: ${req.method} ${req.path} -> ${res.statusCode} (ACAO: ${acaOrigin || 'none'})`);
    } catch (err) {
      console.warn('Could not read response header for logging:', err.message);
    }
  });

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

// Catch uncaught exceptions to avoid unexpected process exit
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Do NOT exit immediately in development — log and attempt to continue
});
