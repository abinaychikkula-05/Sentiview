/**
 * Sentiment Analysis Service
 * Uses the 'sentiment' npm package for text sentiment analysis
 * Can be extended to use Google Cloud NLP API or AWS Comprehend
 */

const Sentiment = require('sentiment');

const sentiment = new Sentiment();

/**
 * Analyze sentiment of text
 * Returns sentiment label (Positive, Negative, Neutral) and score
 *
 * @param {string} text - The text to analyze
 * @returns {object} Sentiment analysis result
 */
exports.analyzeSentiment = (text) => {
  try {
    const result = sentiment.analyze(text);

    // Map sentiment score to label
    let label = 'Neutral';
    let score = result.score;

    // Normalize score to -1 to 1 range
    const normalizedScore = Math.max(-1, Math.min(1, score / 10));

    if (score > 0) {
      label = 'Positive';
    } else if (score < 0) {
      label = 'Negative';
    }

    return {
      label,
      score: normalizedScore,
      confidence: Math.abs(normalizedScore),
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return {
      label: 'Neutral',
      score: 0,
      confidence: 0,
    };
  }
};

/**
 * Batch analyze multiple feedback items
 * @param {array} feedbackArray - Array of feedback texts
 * @returns {array} Array of sentiment results
 */
exports.analyzeBatchSentiment = (feedbackArray) => {
  return feedbackArray.map((text) => exports.analyzeSentiment(text));
};

/**
 * Get sentiment statistics
 * @param {array} sentiments - Array of sentiment objects
 * @returns {object} Statistics object
 */
exports.getSentimentStats = (sentiments) => {
  if (!sentiments || sentiments.length === 0) {
    return {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      averageScore: 0,
    };
  }

  const total = sentiments.length;
  const positive = sentiments.filter((s) => s.label === 'Positive').length;
  const negative = sentiments.filter((s) => s.label === 'Negative').length;
  const neutral = sentiments.filter((s) => s.label === 'Neutral').length;
  const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / total;

  return {
    total,
    positive,
    negative,
    neutral,
    positivePercentage: ((positive / total) * 100).toFixed(2),
    negativePercentage: ((negative / total) * 100).toFixed(2),
    neutralPercentage: ((neutral / total) * 100).toFixed(2),
    averageScore: averageScore.toFixed(2),
  };
};
