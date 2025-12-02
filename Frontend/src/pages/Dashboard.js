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
      const res = await feedbackService.getAllFeedback();
      
      if (typeof res === 'string') {
        setError('Failed to load feedback (Invalid response format)');
        setFeedback([]);
        return;
      }

      setFeedback(res.data || []);
      setStats(res.stats || null);
      setError(null);
    } catch (err) {
      console.error('Error loading feedback:', err);
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

  if (authLoading) return <div className="loading-page">Loading...</div>;
  if (!isAuthenticated) return <div className="loading-page">Please log in.</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>SentiView</h1>
          <span className="user-info">
            Welcome back, {user?.username} • {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <div className="header-right">
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link to="/settings" className="btn btn-secondary">
            Settings
          </Link>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Feedback</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Positive</h3>
            <div className="stat-value" style={{ color: 'var(--success-color)' }}>
              {stats.positive || 0}
            </div>
          </div>
          <div className="stat-card">
            <h3>Negative</h3>
            <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
              {stats.negative || 0}
            </div>
          </div>
          <div className="stat-card">
            <h3>Neutral</h3>
            <div className="stat-value" style={{ color: 'var(--warning-color)' }}>
              {stats.neutral || 0}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="main-section">
          {/* Charts */}
          {stats && (
            <div className="charts-section">
              <div className="section-header">
                <h2>Sentiment Analytics</h2>
              </div>
              <SentimentCharts stats={stats} feedback={feedback} />
            </div>
          )}

          {/* Feedback List */}
          <div className="feedback-section">
            <div className="section-header">
              <h2>Recent Feedback</h2>
              <div className="filter-buttons">
                {['All', 'Positive', 'Negative', 'Neutral'].map((sentiment) => (
                  <button
                    key={sentiment}
                    className={`filter-btn ${filter === sentiment ? 'active' : ''} filter-btn-${sentiment.toLowerCase()}`}
                    onClick={() => handleFilterChange(sentiment)}
                  >
                    {sentiment}
                  </button>
                ))}
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading feedback...</div>
            ) : (
              <FeedbackList feedback={filteredFeedback} onDelete={handleDeleteFeedback} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="upload-card">
            <h3>Add New Feedback</h3>
            <p>Upload CSV files or enter feedback manually to analyze sentiment instantly.</p>
            <button 
              className="upload-btn"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? 'Close Upload' : 'Upload Now'}
            </button>
          </div>

          {showUpload && (
            <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <UploadFeedback onSuccess={handleUploadSuccess} />
            </div>
          )}
        </aside>
      </div>
      
      {error && <div className="error-message" style={{ marginTop: '2rem' }}>{error}</div>}
    </div>
  );
};

export default Dashboard;
