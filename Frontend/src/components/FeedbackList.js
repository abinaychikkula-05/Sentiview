/**
 * Feedback List Component
 * Displays feedback items with sentiment tags
 */

import React from 'react';
import { formatDate, getSentimentColor, getSentimentBgColor } from '../utils/helpers';
import '../styles/Components.css';

const FeedbackList = ({ feedback, onDelete }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="feedback-list">
        <div className="no-data">No feedback found</div>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      {feedback.map((item) => (
        <div
          key={item._id}
          className="feedback-item"
          style={{ borderLeftColor: getSentimentColor(item.sentiment.label) }}
        >
          <div className="feedback-header">
            <div className="feedback-title">
              <div className="title-row">
                <h3>{item.clientName || 'Anonymous'}</h3>
                <span className="category">{item.category}</span>
              </div>
              <div className="feedback-meta">
                <span className="date">{formatDate(item.createdAt)}</span>
              </div>
            </div>
            <div className="feedback-actions">
              <button
                className="btn btn-small btn-delete"
                onClick={() => onDelete(item._id)}
                title="Delete feedback"
                aria-label={`Delete feedback from ${item.clientName || 'Anonymous'}`}
              >
                ✕
              </button>
            </div>
          </div>

          <p className="feedback-text">{item.feedback}</p>

          <div className="feedback-footer">
            <div className="sentiment-badge">
              <span
                className="sentiment-tag"
                style={{
                  backgroundColor: getSentimentBgColor(item.sentiment.label),
                  color: getSentimentColor(item.sentiment.label),
                }}
              >
                {item.sentiment.label}
              </span>
              <span className="sentiment-score">
                Score: {(item.sentiment.score * 100).toFixed(0)}%
              </span>
            </div>
            {item.rating && (
              <div className="rating">
                <span className="stars">★ {item.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
