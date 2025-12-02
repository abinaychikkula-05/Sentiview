/**
 * Dashboard Component
 * Main dashboard showing sentiment analysis and feedback
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import FeedbackList from '../components/FeedbackList';
import SentimentCharts from '../components/SentimentCharts';
import UploadFeedback from '../components/UploadFeedback';
import '../styles/Dashboard.css';
import { feedbackService } from '../services/feedbackService';
import Logo from '../components/Logo';

const Dashboard = () => {
  const { user, logout, loading: authLoading, isAuthenticated, token } = useAuth();
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
          <div className="logo-container">
            <Logo className="dashboard-logo" />
            <h1>SentiView</h1>
          </div>
          <span className="user-info">
            Welcome back, {user?.username}
          </span>
        </div>
        <div className="header-right">
          <div className="date-display">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            <span className="time-separator">•</span>
            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
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
          <div className="stat-card total">
            <div className="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Feedback</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>
          <div className="stat-card positive">
            <div className="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Positive</h3>
              <div className="stat-value">{stats.positive || 0}</div>
            </div>
          </div>
          <div className="stat-card negative">
            <div className="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Negative</h3>
              <div className="stat-value">{stats.negative || 0}</div>
            </div>
          </div>
          <div className="stat-card neutral">
            <div className="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="15" x2="16" y2="15"></line>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Neutral</h3>
              <div className="stat-value">{stats.neutral || 0}</div>
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
