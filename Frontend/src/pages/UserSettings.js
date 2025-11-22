/**
 * User Settings Page
 * Allow users to update their profile (sends to /api/users/me)
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserSettings = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', company: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', email: user.email || '', company: user.company || '' });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="page-container card-glass settings-page">
      <div className="settings-header">
        <h1>User Settings</h1>
        <div>
          <Link to="/dashboard" className="btn btn-ghost">Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} className="form-input" aria-label="username" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={form.email} onChange={handleChange} className="form-input" aria-label="email" />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" value={form.company} onChange={handleChange} className="form-input" aria-label="company" />
        </div>



        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving} style={{ background: '#2563eb', color: '#fff' }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
        </div>

        {message && <div className="muted message">{message}</div>}
      </form>
    </div>
  );
};

export default UserSettings;
