import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';
import './SubmissionDetail.css';
import axios from 'axios';
import { formatLanguage, formatStatus } from '../../utils/format';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/submissions/${id}`);
        setSubmission(response.data);
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError(err.response?.data?.message || 'Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const getStatusIcon = (status) => {
    const upperStatus = (status || '').toUpperCase();
    if (upperStatus === 'ACCEPTED') return <FiCheckCircle className="status-icon" />;
    if (upperStatus === 'PENDING') return <FiClock className="status-icon" />;
    return <FiXCircle className="status-icon" />;
  };

  const getStatusClass = (status) => {
    const upperStatus = (status || '').toUpperCase();
    if (upperStatus === 'ACCEPTED') return 'status-accepted';
    if (upperStatus === 'WRONG_ANSWER') return 'status-wrong';
    if (upperStatus === 'RUNTIME_ERROR') return 'status-error';
    if (upperStatus === 'COMPILATION_ERROR' || upperStatus === 'COMPILE_ERROR') return 'status-compile';
    if (upperStatus === 'TIME_LIMIT_EXCEEDED') return 'status-tle';
    if (upperStatus === 'PENDING') return 'status-pending';
    return 'status-error';
  };

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString();
  };

  // Sidebar component
  const Sidebar = () => (
    <aside className="sd-sidebar">
      <div className="sd-sidebar-top">
        <div className="sd-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
          <span className="sd-logo-uni">Uni</span>Code
        </div>
        <nav className="sd-nav-menu">
          <div className="sd-nav-item" onClick={() => navigate('/dashboard')}>
            <FiGrid className="sd-nav-icon" /> Dashboard
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/problems')}>
            <FiFileText className="sd-nav-icon" /> Problems
          </div>
          <div className="sd-nav-item active" onClick={() => navigate('/profile/submissions')}>
            <FiSend className="sd-nav-icon" /> Submissions
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/profile')}>
            <FiUser className="sd-nav-icon" /> Profile
          </div>
          {isAdmin && (
            <div className="sd-nav-item admin-nav" onClick={() => navigate('/admin')}>
              <FiShield className="sd-nav-icon" /> Admin Panel
            </div>
          )}
        </nav>
      </div>
      <div className="sd-sidebar-bottom">
        <div className="sd-nav-item" onClick={() => navigate('/settings')}>
          <FiSettings className="sd-nav-icon" /> Settings
        </div>
        <div className="sd-nav-item" onClick={handleLogout}>
          <FiLogOut className="sd-nav-icon" /> Log Out
        </div>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-dashboard-container">
          <Sidebar />
          <div className="sd-container">
            <div className="sd-loading">Loading submission details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sd-page">
        <div className="sd-dashboard-container">
          <Sidebar />
          <div className="sd-container">
            <div className="sd-error-container">
              <FiAlertCircle className="error-icon" />
              <p>{error}</p>
              <button className="sd-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="sd-page">
        <div className="sd-dashboard-container">
          <Sidebar />
          <div className="sd-container">
            <div className="sd-error-container">
              <p>Submission not found</p>
              <button className="sd-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <div className="sd-dashboard-container">
        <Sidebar />
        <div className="sd-container">
          <div className="sd-header">
            <button className="sd-back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </button>
            <h1>Submission Details</h1>
          </div>

          {/* Status Card */}
          <div className={`sd-status-card ${getStatusClass(submission.status)}`}>
            {getStatusIcon(submission.status)}
            <span className="status-text">{formatStatus(submission.status)}</span>
          </div>

          {/* Submission Info */}
          <div className="sd-info-grid">
            <div className="sd-info-item">
              <label>Problem</label>
              <span
                className="sd-link"
                onClick={() => navigate(`/problem/${submission.problem?.slug || submission.problem?.id}`)}
              >
                {submission.problem?.title || `Problem #${submission.problem?.id}`}
              </span>
            </div>
            <div className="sd-info-item">
              <label>Language</label>
              <span>{formatLanguage(submission.language)}</span>
            </div>
            <div className="sd-info-item">
              <label>Submitted At</label>
              <span>{formatDateTime(submission.submittedAt)}</span>
            </div>
            <div className="sd-info-item">
              <label>Runtime</label>
              <span>{submission.executionTimeMs != null ? `${submission.executionTimeMs} ms` : '-'}</span>
            </div>
            <div className="sd-info-item">
              <label>Memory (KB)</label>
              <span>{submission.memoryUsedKb != null ? submission.memoryUsedKb : '-'}</span>
            </div>
            <div className="sd-info-item">
              <label>Test Cases</label>
              <span>{submission.testCasesPassed ?? 0} / {submission.totalTestCases ?? 0}</span>
            </div>
            <div className="sd-info-item">
              <label>Difficulty</label>
              <span className={`difficulty-badge difficulty-${(submission.problem?.difficulty || '').toLowerCase()}`}>
                {submission.problem?.difficulty || '-'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {submission.errorMessage && (
            <div className="sd-error-section">
              <h3>Error Message</h3>
              <pre className="sd-error-output">{submission.errorMessage}</pre>
            </div>
          )}

          {/* Code */}
          <div className="sd-code-section">
            <h3>Submitted Code</h3>
            <pre className="sd-code">{submission.code}</pre>
          </div>

          {/* Output */}
          {submission.output && (
            <div className="sd-output-section">
              <h3>Output</h3>
              <pre className="sd-output">{submission.output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
