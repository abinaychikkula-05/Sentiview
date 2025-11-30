/**
 * Admin Dashboard Page
 * Admin controls for user management, system stats, and analytics
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Components.css';

const AdminPage = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [allowRegistrations, setAllowRegistrations] = useState(() => {
    return localStorage.getItem('allowRegistrations') === 'true';
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const defaultLayout = ['SentimentCharts', 'Filter', 'FeedbackList', 'UploadFeedback'];
  const [layout, setLayout] = useState(() => {
    try {
      const v = localStorage.getItem('dashboardLayout');
      return v ? JSON.parse(v) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  // Fetch users and stats on mount
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const deleteUser = async (userId, username) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setMessage(`User ${username} deleted successfully`);
      setShowDeleteConfirm(null);
      setTimeout(() => setMessage(''), 3000);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const toggleRegistrations = () => {
    const next = !allowRegistrations;
    setAllowRegistrations(next);
    localStorage.setItem('allowRegistrations', next ? 'true' : 'false');
    setMessage(`Registrations ${next ? 'enabled' : 'disabled'}`);
    setTimeout(() => setMessage(''), 3000);
  };

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
    try {
      const res = await fetch('/api/admin/settings/layout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ layout }),
      });
      if (!res.ok) throw new Error('no-backend');
      setMessage('Layout saved to server');
    } catch (err) {
      localStorage.setItem('dashboardLayout', JSON.stringify(layout));
      setMessage('Layout saved locally');
    }
    setTimeout(() => setMessage(''), 3000);
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

      {/* System Statistics */}
      {stats && (
        <section className="admin-stats">
          <h2>System Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats.users.total}</div>
              <div className="stat-detail">{stats.users.admins} admin(s)</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Feedback</div>
              <div className="stat-value">{stats.feedback.total}</div>
              <div className="stat-detail">items submitted</div>
            </div>
            {stats.feedback.bySentiment && stats.feedback.bySentiment.map((sent) => (
              <div key={sent._id} className="stat-card">
                <div className="stat-label">{sent._id || 'Unknown'}</div>
                <div className="stat-value">{sent.count}</div>
                <div className="stat-detail">avg score: {(sent.avgScore || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Contributors */}
      {stats && stats.feedback.topContributors && stats.feedback.topContributors.length > 0 && (
        <section className="top-contributors">
          <h2>Top Feedback Contributors</h2>
          <div className="contributor-list">
            {stats.feedback.topContributors.map((contrib, idx) => (
              <div key={contrib.userId} className="contributor-item">
                <span className="rank">#{idx + 1}</span>
                <div className="contributor-info">
                  <div className="contributor-name">{contrib.username}</div>
                  <div className="contributor-email">{contrib.email}</div>
                </div>
                <div className="contributor-count">{contrib.feedbackCount} items</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Site Settings */}
      <section className="admin-controls">
        <h2>Site Settings</h2>
        <div className="setting-item">
          <label>Allow new registrations (local override)</label>
          <button className="btn btn-primary" onClick={toggleRegistrations}>
            {allowRegistrations ? 'Disable' : 'Enable'}
          </button>
        </div>
      </section>

      {/* User Management */}
      <section className="manage-users">
        <h2>Manage Users</h2>
        <div className="controls">
          <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {message && <div className="success-alert">{message}</div>}

        {users.length > 0 ? (
          <div className="user-management-list">
            {users.map((u) => (
              <div key={u._id} className="user-management-row">
                <div className="user-details">
                  <div className="user-name">{u.username}</div>
                  <div className="user-email muted">{u.email}</div>
                  <div className="user-date muted">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="user-role">
                  <span className={`role-badge role-${u.role}`}>{u.role || 'user'}</span>
                </div>
                <div className="user-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowDeleteConfirm(u._id)}
                    disabled={u.role === 'admin' && user?.email === u.email}
                  >
                    Delete
                  </button>
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === u._id && (
                    <div className="delete-confirmation">
                      <p>Delete {u.username}? All their feedback will also be deleted.</p>
                      <div className="confirmation-buttons">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteUser(u._id, u.username)}
                        >
                          Confirm Delete
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="muted">No users found.</div>
        )}
      </section>

      {/* Dashboard Layout Manager */}
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
