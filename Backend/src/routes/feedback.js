/**
 * Feedback Routes
 * Handles feedback endpoints and sentiment analysis
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadFeedback,
  addFeedback,
  getAllFeedback,
  getFeedbackById,
  getSentimentAnalytics,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// All routes require authentication
router.use(protect);

router.post('/upload', upload.single('file'), uploadFeedback);
router.post('/', addFeedback);
router.get('/', getAllFeedback);
router.get('/analytics/summary', getSentimentAnalytics);
router.get('/:id', getFeedbackById);
router.delete('/:id', deleteFeedback);

module.exports = router;
