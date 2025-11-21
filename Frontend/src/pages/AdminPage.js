/**
 * Admin Dashboard Page
 * Basic admin controls and user management helpers
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allowRegistrations, setAllowRegistrations] = useState(() => {
    return localStorage.getItem('allowRegistrations') === 'true';
  });

  useEffect(() => {
    // optional: try to fetch real users from API
    // if API not available this will surface an error gracefully
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      setError('Could not load users — backend may not implement this endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRegistrations = () => {
    const next = !allowRegistrations;
    setAllowRegistrations(next);
    localStorage.setItem('allowRegistrations', next ? 'true' : 'false');
  };

  // Dashboard layout management (admin can reorder which widgets appear and their order)
  const defaultLayout = ['SentimentCharts', 'Filter', 'FeedbackList', 'UploadFeedback'];
  const [layout, setLayout] = useState(() => {
    try {
      const v = localStorage.getItem('dashboardLayout');
      return v ? JSON.parse(v) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  const moveUp = (index) => {
    if (index <= 0) return;
    const next = [...layout];
    const tmp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = tmp;
    setLayout(next);
  };

  const moveDown = (index) => {
    if (index >= layout.length - 1) return;
    const next = [...layout];
    const tmp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = tmp;
    setLayout(next);
  };

  const saveLayout = async () => {
    // Try to save to backend first, fall back to localStorage
    try {
      const res = await fetch('/api/admin/settings/layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout }),
      });
      if (!res.ok) throw new Error('no-backend');
      setMessage('Layout saved to server');
    } catch (err) {
      // fallback
      localStorage.setItem('dashboardLayout', JSON.stringify(layout));
      setMessage('Layout saved locally (no backend endpoint)');
    }
  };

  return (
    <div className="page-container card-glass admin-page">
      <div className="settings-header">
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/dashboard" className="btn btn-ghost">Back</Link>
        </div>
      </div>

      <p>Signed in as <strong>{user?.username}</strong> <span className="muted">({user?.role || 'user'})</span></p>

      <section className="admin-controls">
        <h2>Site Settings</h2>
        <div className="setting-item">
          <label>Allow new registrations (local override)</label>
          <button className="btn btn-primary" onClick={toggleRegistrations}>
            {allowRegistrations ? 'Disable' : 'Enable'}
          </button>
        </div>
      </section>

      <section className="manage-users">
        <h2>Manage Users</h2>
        <p className="muted">You can attempt to load users from the backend API.</p>
        <div className="controls">
          <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Load Users'}
          </button>
        </div>
        {error && <div className="error-alert">{error}</div>}
        {users.length > 0 ? (
          <ul className="user-list">
            {users.map((u) => (
              <li key={u._id || u.id} className="user-row">
                <div>
                  <div className="user-name">{u.username || u.name}</div>
                  <div className="user-email muted">{u.email}</div>
                </div>
                <div className="role">{u.role || 'user'}</div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <div className="muted">No users loaded yet.</div>
        )}
      </section>

      <section className="layout-manager">
        <h2>Dashboard Layout</h2>
        <p className="muted">Reorder widgets to change dashboard composition. Click save to persist.</p>
        <ul className="user-list layout-list">
          {layout.map((item, idx) => (
            <li key={item} className="user-row layout-row">
              <div className="user-name">{item}</div>
              <div className="controls">
                <button className="btn" onClick={() => moveUp(idx)} disabled={idx === 0}>↑</button>
                <button className="btn" onClick={() => moveDown(idx)} disabled={idx === layout.length - 1}>↓</button>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" onClick={saveLayout}>Save Layout</button>
          <button className="btn btn-ghost" onClick={() => { setLayout(defaultLayout); setMessage('Reset to default'); }}>Reset</button>
        </div>
        {message && <div className="muted" style={{ marginTop: 8 }}>{message}</div>}
      </section>
    </div>
  );
};

export default AdminPage;
