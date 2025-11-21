/**
 * Feedback Model
 * Stores client feedback with sentiment analysis results
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
    },
    feedback: {
      type: String,
      required: [true, 'Please provide feedback text'],
    },
    sentiment: {
      label: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral'],
        required: true,
      },
      score: {
        type: Number,
        min: -1,
        max: 1,
        required: true,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 1,
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    category: {
      type: String,
      default: 'General',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ 'sentiment.label': 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
