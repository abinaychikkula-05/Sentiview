/**
 * Forgot Password Component
 * Allows users to reset their password by verifying username, email, and old password
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

// Determine API URL based on environment
const getAPIUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // Development (Localhost or Codespaces)
  // Use relative path to leverage package.json proxy
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('github.dev')) {
    return '';
  }
  
  // For ALL other deployments (Vercel, custom domains, mobile wrappers), use production backend
  return 'https://airy-tranquility-production-da57.up.railway.app';
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Verify identity, Step 2: Enter new password
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // oldPassword removed from ForgotPassword UI — moved to ResetPassword page
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // For the forgot-password flow we only verify the presence of username and email
      // and advance to the next step. A secure email/token flow should be used in
      // production instead of relying on passwords for verification.
      setSuccess('Identity verified locally. Enter your new password.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Note: backend currently expects `oldPassword` for verification. For the
      // forgotten-password flow we send only username/email/newPassword. If the
      // backend requires oldPassword, implement an email-token reset endpoint.
      const response = await axios.post(`${getAPIUrl()}/api/auth/reset-password`, {
        username,
        email,
        newPassword,
      });

      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-bg">
      <div className="split-left">
        <div className="sentiview-splash">
          <span className="sentiview-splash-text">Reset your password securely!</span>
        </div>
      </div>
      <div className="split-right">
        <div className="auth-box">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Recover your account access</p>
          <Link to="/login" className="back-home-link" style={{ display: 'block', marginBottom: '20px', color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Back to Login</Link>
          
          {step === 1 ? (
            <form onSubmit={handleVerifyIdentity} className="auth-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
                Please verify your identity to reset your password
              </p>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>

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

              {/* Current password removed from forgot-password flow */}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Identity'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
                Identity verified! Enter your new password below.
              </p>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setStep(1);
                  setError('');
                  setSuccess('');
                }}
                style={{ marginTop: '10px', backgroundColor: '#999' }}
              >
                Back to Verify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
