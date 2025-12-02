/**
 * Dashboard Component
 * Main dashboard showing sentiment analysis and feedback
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import FeedbackList from '../components/FeedbackList';
import SentimentCharts from '../components/SentimentCharts';
import UploadFeedback from '../components/UploadFeedback';
import '../styles/Dashboard.css';
import { feedbackService } from '../services/feedbackService';

const Dashboard = () => {
  const { user, logout, loading: authLoading, isAuthenticated, token } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const defaultLayout = ['SentimentCharts', 'Filter', 'FeedbackList', 'UploadFeedback'];
  const [layout, setLayout] = useState(defaultLayout);

  useEffect(() => {
    let didCancel = false;
    if (isAuthenticated && token) {
      const fetchOnce = async () => {
        if (!didCancel) await loadFeedback();
      };
      fetchOnce();
    }
    return () => { didCancel = true; };
  }, [isAuthenticated, token]);

  // Live timestamp updater
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // read saved layout on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem('dashboardLayout');
      if (v) setLayout(JSON.parse(v));
    } catch (e) {
      // ignore layout errors
    }
  }, []);

  // Filter feedback by sentiment
  const filteredFeedback =
    filter === 'All'
      ? feedback
      : feedback.filter((f) => f.sentiment.label === filter);

  // Handle filter change
  const handleFilterChange = (sentiment) => {
    setFilter(sentiment);
  };

  // Handle upload success
  const handleUploadSuccess = () => {
    loadFeedback();
    setShowUpload(false);
  };

  // Handle feedback delete
  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
      await loadFeedback();
    } catch (err) {
      setError('Failed to delete feedback');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Load feedback and stats
  async function loadFeedback() {
    setLoading(true);
    try {
      console.log('🔄 Fetching feedback...');
      const res = await feedbackService.getAllFeedback();
      console.log('✅ Feedback fetched RAW:', JSON.stringify(res, null, 2));
      
      if (typeof res === 'string') {
        console.error('❌ Received string response instead of JSON. Proxy might be returning HTML.');
        setError('Failed to load feedback (Invalid response format)');
        setFeedback([]);
        return;
      }

      if (res.data) {
        console.log(`📊 Data length: ${res.data.length}`);
      } else {
        console.warn('⚠️ res.data is missing!');
      }

      setFeedback(res.data || []);
      setStats(res.stats || null);
      setError(null);
    } catch (err) {
      console.error('Error loading feedback:', err);
      // Show error for all cases except 401 (handled by auth redirect)
      if (err.response?.status === 401) {
        setError(null);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load feedback';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>SentiView Dashboard</h1>
            {user && <p className="user-info">Welcome, {user.username} ({user.email})!</p>}
          </div>
          <div className="header-right">
            <button
              className="btn btn-theme"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? 'Hide Upload' : 'Upload Feedback'}
            </button>
            <Link to="/settings" className="btn btn-ghost">
              Settings
            </Link>
            {user && (
              <button
                className="btn btn-danger"
                onClick={logout}
                style={{ marginLeft: '8px' }}
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Animated Banner with timestamp and username */}
        <div className="dashboard-banner" role="region" aria-label="announcement banner">
          <div className="banner-inner">
            <div className="banner-marquee" aria-hidden="true">
              <span className="banner-text">
                {user && user.username ? user.username : ''}
              </span>
            </div>
            <div className="banner-timestamp">
              {currentTime.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-alert">{error}</div>}

        {/* Auth loading spinner */}
        {authLoading ? (
          <div className="loading">Loading user session...</div>
        ) : !isAuthenticated ? (
          <div className="not-authenticated">Please log in to view feedback.</div>
        ) : (
          <>
            {/* Filter Section (only once) */}
            <div className="filter-section">
              <h2>Feedback Analysis</h2>
              <div className="filter-buttons">
                {['All', 'Positive', 'Negative', 'Neutral'].map((sentiment) => (
                  <button
                    key={sentiment}
                    className={`filter-btn ${filter === sentiment ? 'active' : ''}`}
                    onClick={() => handleFilterChange(sentiment)}
                  >
                    {sentiment}
                    {sentiment === 'All'
                      ? ` (${feedback.length})`
                      : ` (${feedback.filter((f) => f.sentiment.label === sentiment).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Main dashboard layout */}
            <div className="dashboard-main">
              {layout.map((widget) => {
                if (widget === 'SentimentCharts') {
                  return (
                    !loading && stats && (
                      <section key={widget} className="analytics-section">
                        <SentimentCharts stats={stats} feedback={feedback} />
                      </section>
                    )
                  );
                }
                if (widget === 'UploadFeedback') {
                  return showUpload ? (
                    <section key={widget} className="upload-section card-glass">
                      <UploadFeedback onSuccess={handleUploadSuccess} />
                    </section>
                  ) : null;
                }
                if (widget === 'FeedbackList') {
                  return (
                    <div key={widget} className="feedback-list-wrapper">
                      {filteredFeedback.length === 0 ? (
                        <div className="no-feedback">No feedback found.</div>
                      ) : (
                        <FeedbackList feedback={filteredFeedback} onDelete={handleDeleteFeedback} />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
