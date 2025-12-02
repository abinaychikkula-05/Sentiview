import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LandingPage.css';
import Logo from '../components/Logo';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <Logo className="landing-logo" />
          </div>
          <div className="brand-text">
            SentiView
            <span className="brand-tagline">: Client Feedback Analysis and Sentiment Dashboard</span>
          </div>
        </div>
        
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`landing-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/login" className="nav-link mobile-only">Sign In</Link>
          <Link to="/register" className="nav-link mobile-only">Sign Up</Link>
          <a href="#contact" className="nav-link mobile-only">Contact</a>
          <a href="#help" className="nav-link mobile-only">Help</a>
          
          <div className="desktop-auth-buttons">
            <Link to="/login" className="btn btn-primary btn-glow">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-glow">Sign Up</Link>
          </div>
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

        <section id="contact" className="contact-section">
          <div className="contact-content">
            <h2 className="section-title">Get in Touch</h2>
            <div className="contact-card">
              <div className="contact-info">
                <h3>We're Here to Help</h3>
                <p className="contact-desc">
                  Ready to transform your customer feedback into actionable insights? 
                  Whether you have questions about our AI models, need enterprise solutions, 
                  or just want to say hello, our team is ready to assist you.
                </p>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <div className="contact-text">
                      <span className="label">Email Us</span>
                      <a href="mailto:admininfo@sentiview.com" className="value">admininfo@sentiview.com</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🌐</span>
                    <div className="contact-text">
                      <span className="label">Visit Us</span>
                      <span className="value">www.sentiview.com</span>
                    </div>
                  </div>
                </div>
              </div>
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
