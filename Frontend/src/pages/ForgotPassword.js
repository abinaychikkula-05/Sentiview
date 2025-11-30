/**
 * Forgot Password Component
 * Allows users to reset their password by verifying username, email, and old password
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Verify identity, Step 2: Enter new password
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !oldPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Verify credentials
      const response = await axios.post('/api/auth/login', {
        email,
        password: oldPassword,
      });

      if (response.data.success) {
        // Verify username matches
        if (response.data.user.username !== username) {
          setError('Username does not match the email');
          setLoading(false);
          return;
        }
        setSuccess('Identity verified! Now enter your new password.');
        setStep(2);
      }
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
      const response = await axios.post('/api/auth/reset-password', {
        username,
        email,
        oldPassword,
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

              <div className="form-group">
                <label htmlFor="oldPassword">Current Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                />
              </div>

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
