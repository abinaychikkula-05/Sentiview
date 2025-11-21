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
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const defaultLayout = ['SentimentCharts', 'Filter', 'FeedbackList', 'UploadFeedback'];
  const [layout, setLayout] = useState(defaultLayout);

  useEffect(() => {
    let didCancel = false;
    if (user && user.token) {
      const fetchOnce = async () => {
        if (!didCancel) await loadFeedback();
      };
      fetchOnce();
    }
    return () => { didCancel = true; };
  }, [user]);

  // read saved layout on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem('dashboardLayout');
      if (v) setLayout(JSON.parse(v));
    } catch (e) {
      setLayout(defaultLayout);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllFeedback();
      setFeedback(data.data);
      setStats(data.stats);
      setError('');
    } catch (err) {
      setError('Failed to load feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (sentiment) => {
    setFilter(sentiment);
  };

  const handleUploadSuccess = () => {
     setShowUpload(false);
     loadFeedback();
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
        setFeedback((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError('Failed to delete feedback');
    }
  };

  const filteredFeedback =
      filter === 'All'
        ? feedback
        : feedback.filter((f) => f.sentiment.label === filter);

    // Clear feedback state on logout
    useEffect(() => {
      if (!user) {
        setFeedback([]);
        setStats(null);
      }
    }, [user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>SentiView Dashboard</h1>
          {user && <p className="user-info">Welcome, {user.username}!</p>}
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
          {user && user.role === 'admin' && (
            <Link to="/admin" className="btn btn-warning">
              Admin
            </Link>
          )}
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Upload Section */}
      {/* Render sections according to admin-configured layout */}
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

        if (widget === 'Filter') {
          return (
            <div key={widget} className="filter-section">
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
          );
        }

        if (widget === 'UploadFeedback') {
          return (
            <section key={widget} className="upload-section card-glass">
              {showUpload ? <UploadFeedback onSuccess={handleUploadSuccess} /> : null}
            </section>
          );
        }

        if (widget === 'FeedbackList') {
          return (
            <div key={widget} className="feedback-list-wrapper">
              {loading ? (
                <div className="loading">Loading feedback...</div>
              ) : (
                <FeedbackList feedback={filteredFeedback} onDelete={handleDeleteFeedback} />
              )}
            </div>
          );
        }

        return null;
      })}

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

      <div className="dashboard-main">
        <div className="left-col">
          {/* Charts Section */}
          {!loading && stats && (
            <section className="analytics-section">
              <SentimentCharts stats={stats} feedback={feedback} />
            </section>
          )}

          {/* Filter Section */}
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
        </div>

        <div className="right-col">
          {/* Feedback List */}
          {loading ? (
            <div className="loading">Loading feedback...</div>
          ) : (
            <FeedbackList
              feedback={filteredFeedback}
              onDelete={handleDeleteFeedback}
            />
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
