/**
 * Login Component
 * User authentication form
 * CORS preflight fix applied
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="split-bg">
      <div className="split-left">
        <div className="sentiview-splash">
          <span className="sentiview-splash-text">Your feedback is our guiding light!</span>
        </div>
      </div>
      <div className="split-right">
        <div className="auth-box">
          <div className="auth-header">
            <Logo className="auth-logo" />
            <h1 className="auth-title">Sentiview</h1>
          </div>
          <p className="auth-subtitle">Client Feedback Analysis Dashboard</p>
          <Link to="/" className="back-home-link" style={{ display: 'block', marginBottom: '20px', color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</Link>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="auth-footer">
            <Link to="/forgot-password" className="link" style={{ fontSize: '13px', marginRight: '8px' }}>
              Forgot Password?
            </Link>
            |
            <span style={{ marginLeft: '8px' }}>
              Don't have an account?{' '}
              <a href="/register" className="link">
                Sign up here
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
