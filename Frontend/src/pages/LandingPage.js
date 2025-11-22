import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="landing-container">
      <div className="landing-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <header className="landing-header">
        <div className="brand-container">
          <div className="brand-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="url(#logo_gradient)" />
              <path d="M10 20C10 20 13.5 14 20 14C26.5 14 30 20 30 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 25C10 25 13.5 20 20 20C26.5 20 30 25 30 25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7"/>
              <defs>
                <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563eb"/>
                  <stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">SentiView: Client Feedback Analysis and Sentiment Dashboard</div>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="btn btn-primary btn-glow">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-glow">Sign Up</Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-content">
            <div className="hero-badge">✨ AI-Powered Analytics</div>
            <h1 className="hero-title">
              Turn Feedback into <br />
              <span className="text-gradient">Actionable Growth</span>
            </h1>
            <p className="hero-subtitle">
              SentiView uses advanced sentiment analysis to transform raw customer feedback into clear, data-driven insights for your business.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">98%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Real-time</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview card-glass">
              <div className="preview-header">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="preview-body">
                <div className="chart-placeholder">
                  <div className="bar" style={{height: '40%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                  <div className="bar" style={{height: '50%'}}></div>
                  <div className="bar" style={{height: '85%'}}></div>
                  <div className="bar" style={{height: '60%'}}></div>
                </div>
                <div className="sentiment-row">
                  <div className="sentiment-tag positive">Positive 65%</div>
                  <div className="sentiment-tag neutral">Neutral 20%</div>
                </div>
              </div>
            </div>
            <div className="floating-card card-1">
              <span>😊</span> Great Service!
            </div>
            <div className="floating-card card-2">
              <span>📈</span> Trending Up
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why SentiView?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">📊</div>
              <h3 className="feature-title">Sentiment Analysis</h3>
              <p className="feature-desc">
                Automatically categorize feedback into positive, negative, or neutral sentiments using advanced AI models.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">📈</div>
              <h3 className="feature-title">Trend Tracking</h3>
              <p className="feature-desc">
                Visualize feedback trends over time to identify improvements or potential issues before they escalate.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">🎯</div>
              <h3 className="feature-title">Actionable Insights</h3>
              <p className="feature-desc">
                Turn raw customer feedback into meaningful data that drives strategic business decisions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2025 SentiView. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
