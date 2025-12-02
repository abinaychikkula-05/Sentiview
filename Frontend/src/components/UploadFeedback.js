/**
 * Upload Feedback Component
 * Handles CSV upload and manual feedback entry
 */

import React, { useState } from 'react';
import { feedbackService } from '../services/feedbackService';
import '../styles/Components.css';

const UploadFeedback = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    feedback: '',
    rating: '',
    category: 'General',
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUploadCSV = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const response = await feedbackService.uploadCSV(file);
      setSuccess(`Successfully uploaded ${response.data.length} feedback items`);
      setFile(null);
      setTimeout(() => {
        onSuccess();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!formData.feedback.trim()) {
      setError('Please enter feedback text');
      return;
    }

    if (!formData.rating) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      await feedbackService.addFeedback(
        formData.clientName || 'Anonymous',
        formData.feedback,
        parseInt(formData.rating),
        formData.category
      );
      setSuccess('Feedback added successfully');
      setFormData({
        clientName: '',
        feedback: '',
        rating: '',
        category: 'General',
      });
      setTimeout(() => {
        onSuccess();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-feedback-container">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload CSV
        </button>
        <button
          className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          Add Manually
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {activeTab === 'upload' ? (
        <form onSubmit={handleUploadCSV} className="upload-form">
          <div className="form-group">
            <label>Select CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
            <p className="help-text">
              CSV should contain: clientName, feedback, rating, category
            </p>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAddFeedback} className="add-feedback-form">
          <div className="form-group">
            <label htmlFor="clientName">Client Name (optional)</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleFormChange}
              placeholder="Enter client name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Feedback *</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleFormChange}
              placeholder="Enter feedback text"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleFormChange}
              >
                <option value="" disabled>Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="General">General</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Product Quality">Product Quality</option>
                <option value="Pricing">Pricing</option>
                <option value="Logistics">Logistics</option>
                <option value="User Experience">User Experience</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadFeedback;
