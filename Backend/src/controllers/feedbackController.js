/**
 * Feedback Controller
 * Handles feedback upload, retrieval, and sentiment analysis
 */

const Feedback = require('../models/Feedback');
const { analyzeSentiment, getSentimentStats } = require('../services/sentimentService');
const fs = require('fs');
const csv = require('csv-parser');

/**
 * Upload feedback via CSV
 * POST /api/feedback/upload
 */
exports.uploadFeedback = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const feedbackData = [];
    const filePath = req.file.path;

    // Parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        feedbackData.push(row);
      })
      .on('end', async () => {
        try {
          const savedFeedback = [];

          // Process each feedback item
          for (const item of feedbackData) {
            const sentimentAnalysis = analyzeSentiment(item.feedback);

            const feedback = new Feedback({
              userId: req.user.userId,
              clientName: item.clientName || 'Anonymous',
              feedback: item.feedback,
              sentiment: sentimentAnalysis,
              rating: item.rating || null,
              category: item.category || 'General',
            });

            const saved = await feedback.save();
            savedFeedback.push(saved);
          }

          // Clean up uploaded file
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
          });

          res.status(201).json({
            success: true,
            message: `Successfully uploaded ${savedFeedback.length} feedback items`,
            data: savedFeedback,
          });
        } catch (error) {
          next(error);
        }
      })
      .on('error', (error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Add single feedback
 * POST /api/feedback
 */
exports.addFeedback = async (req, res, next) => {
  try {
    console.log('📝 Adding feedback:', req.body);
    const { clientName, feedback, rating, category } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback text is required',
      });
    }

    const sentimentAnalysis = analyzeSentiment(feedback);
    console.log('🧠 Sentiment analysis:', sentimentAnalysis);

    const feedbackDoc = await Feedback.create({
      userId: req.user.userId,
      clientName: clientName || 'Anonymous',
      feedback,
      sentiment: sentimentAnalysis,
      rating: rating || null,
      category: category || 'General',
    });

    console.log('✅ Feedback saved:', feedbackDoc._id);

    res.status(201).json({
      success: true,
      data: feedbackDoc,
    });
  } catch (error) {
    console.error('❌ Error adding feedback:', error);
    next(error);
  }
};

/**
 * Get all feedback for user
 * GET /api/feedback
 */
exports.getAllFeedback = async (req, res, next) => {
  try {
    console.log('🔍 Fetching feedback for user:', req.user.userId);
    const { startDate, endDate, sentiment } = req.query;
    const filter = { userId: req.user.userId };

    // Add date filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Add sentiment filter if provided
    if (sentiment) {
      filter['sentiment.label'] = sentiment;
    }

    const feedback = await Feedback.find(filter).sort({ createdAt: -1 });
    console.log(`✅ Found ${feedback.length} feedback items`);

    const stats = getSentimentStats(feedback.map((f) => f.sentiment));

    res.status(200).json({
      success: true,
      count: feedback.length,
      stats,
      data: feedback,
    });
  } catch (error) {
    console.error('❌ Error fetching feedback:', error);
    next(error);
  }
};

/**
 * Get feedback by ID
 * GET /api/feedback/:id
 */
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get sentiment analytics
 * GET /api/feedback/analytics/summary
 */
exports.getSentimentAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user.userId };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const feedback = await Feedback.find(filter);
    const stats = getSentimentStats(feedback.map((f) => f.sentiment));

    // Get sentiment trend over time
    const trendData = await Feedback.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' },
          positive: {
            $sum: {
              $cond: [{ $eq: ['$sentiment.label', 'Positive'] }, 1, 0],
            },
          },
          negative: {
            $sum: {
              $cond: [{ $eq: ['$sentiment.label', 'Negative'] }, 1, 0],
            },
          },
          neutral: {
            $sum: {
              $cond: [{ $eq: ['$sentiment.label', 'Neutral'] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
      trend: trendData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete feedback
 * DELETE /api/feedback/:id
 */
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
