import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiSearch, FiBell, FiChevronDown, FiTrendingUp, FiAward, FiTarget } from 'react-icons/fi';
import { FaUserCircle, FaFire, FaCheckCircle, FaClock } from 'react-icons/fa';
import { getDashboardStats } from '../../API/api-dashboard.js';
import { getUserSubmissions } from '../../API/api-submission.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const username = localStorage.getItem('username') || 'Guest';
  const userId = localStorage.getItem('userId') || localStorage.getItem('user_id') || '1';

  useEffect(() => {
    async function loadDashboardData() {
      // Set initial empty state immediately so dashboard can render
      setUserStats({
        totalSolved: 0,
        totalAttempted: 0,
        acceptanceRate: 0,
        currentStreak: 0,
        maxStreak: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSubmissions: 0,
        recentActivity: [0, 0, 0, 0, 0, 0, 0]
      });
      setRecentSubmissions([]);
      setLoading(false); // Show dashboard immediately with zeros
      
      try {
        console.log('Fetching dashboard data for userId:', userId);
        
        // Try to fetch user stats from backend
        const statsResponse = await getDashboardStats(userId);
        const stats = statsResponse.data;
        
        console.log('Dashboard stats loaded:', stats);
        
        // Fetch recent submissions using the same API as Submission History
        try {
          const submissionsResponse = await getUserSubmissions(userId);
          console.log('User submissions response:', submissionsResponse.data);
          
          // The API returns an array of submissions directly
          const allSubmissions = Array.isArray(submissionsResponse.data) 
            ? submissionsResponse.data 
            : [];
          
          console.log('All submissions:', allSubmissions);
          
          // Calculate total submissions from actual data
          const totalSubmissionsCount = allSubmissions.length;
          
          // Update stats with real backend data and actual total submissions
          if (stats) {
            setUserStats({
              totalSolved: stats.totalProblemsSolved || 0,
              totalAttempted: stats.totalProblemsAttempted || 0,
              acceptanceRate: stats.acceptanceRate || 0,
              currentStreak: 0,
              maxStreak: 0,
              easySolved: stats.easyProblemsSolved || 0,
              mediumSolved: stats.mediumProblemsSolved || 0,
              hardSolved: stats.hardProblemsSolved || 0,
              totalSubmissions: totalSubmissionsCount, // Use actual count from submissions
              recentActivity: [0, 0, 0, 0, 0, 0, 0]
            });
          }
          
          // Sort by submission time (newest first) and take first 4
          const sortedSubmissions = allSubmissions
            .sort((a, b) => {
              const timeA = new Date(a.submittedAt || 0).getTime();
              const timeB = new Date(b.submittedAt || 0).getTime();
              return timeB - timeA; // Newest first
            })
            .slice(0, 4);
          
          console.log('Recent 4 submissions:', sortedSubmissions);
          console.log('Total submissions count:', totalSubmissionsCount);
          
          // Transform submissions data
          if (sortedSubmissions && sortedSubmissions.length > 0) {
            setRecentSubmissions(sortedSubmissions.map(sub => ({
              id: sub.id || Math.random(),
              problem: sub.problemTitle || sub.problem?.title || sub.title || 'Unknown Problem',
              status: sub.status || 'PENDING',
              language: sub.language || 'N/A',
              time: formatTimeAgo(sub.submittedAt || sub.createdAt),
              difficulty: sub.problemDifficulty || sub.problem?.difficulty || sub.difficulty || 'Easy'
            })));
          } else {
            setRecentSubmissions([]);
          }
        } catch (submissionErr) {
          console.warn('Could not load submissions, keeping empty state:', submissionErr);
          // Keep empty submissions array
          // Still try to set stats from backend if available
          if (stats) {
            setUserStats({
              totalSolved: stats.totalProblemsSolved || 0,
              totalAttempted: stats.totalProblemsAttempted || 0,
              acceptanceRate: stats.acceptanceRate || 0,
              currentStreak: 0,
              maxStreak: 0,
              easySolved: stats.easyProblemsSolved || 0,
              mediumSolved: stats.mediumProblemsSolved || 0,
              hardSolved: stats.hardProblemsSolved || 0,
              totalSubmissions: 0, // No submissions if API fails
              recentActivity: [0, 0, 0, 0, 0, 0, 0]
            });
          }
        }
        
      } catch (err) {
        console.error('Error loading dashboard data (will show zeros):', err);
        console.error('Error details:', err.response?.status, err.response?.data || err.message);
        setError('Could not load data from backend');
        // Keep the empty/zero state already set
      }
    }
    
    loadDashboardData();
  }, [userId]);
  
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '-';
    try {
      const now = new Date();
      const past = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(past.getTime())) return '-';
      
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return '-';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'ACCEPTED': return 'status-accepted';
      case 'WRONG_ANSWER': return 'status-wrong';
      case 'RUNTIME_ERROR': return 'status-error';
      default: return 'status-pending';
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return '';
    const diffLower = String(difficulty).toLowerCase();
    switch(diffLower) {
      case 'easy': return 'diff-easy';
      case 'medium': return 'diff-medium';
      case 'hard': return 'diff-hard';
      default: return '';
    }
  };

  // Always show dashboard, don't wait for data
  if (!userStats) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
              <span className="logo-uni">Uni</span>Code
            </div>
            <nav className="nav-menu">
              <div className="nav-item active" onClick={() => navigate('/dashboard')}> 
                <FiGrid className="nav-icon" /> Dashboard 
              </div>
              <div className="nav-item" onClick={() => navigate('/problems')}> 
                <FiFileText className="nav-icon" /> Problems 
              </div>
              <div className="nav-item" onClick={() => navigate('/profile/submissions')}> 
                <FiSend className="nav-icon" /> Submissions 
              </div>
              <div className="nav-item" onClick={() => navigate('/profile')}>
                <FiUser className="nav-icon" /> Profile
              </div>
            </nav>
          </div>
          <div className="sidebar-bottom">
            <div className="nav-item"onClick={() => navigate('/settings')}>
              <FiSettings className="nav-icon" /> Settings
            </div>
            <div className="nav-item" onClick={handleLogout}> 
              <FiLogOut className="nav-icon" /> Log Out 
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* HEADER */}
          <header className="header">
            <div className="welcome-text">
              <h1 style={{color: 'var(--text-primary)'}}>Welcome back, {username}! 👋</h1>
              <p style={{color: 'var(--text-secondary)'}}>Here's your coding progress overview</p>
            </div>
            <div className="header-actions">
              <div className="user-controls">
                <div className="notification-icon">
                  <FiBell /> <span className="dot"></span>
                </div>
                <div className="user-avatar"> 
                  <FaUserCircle /> 
                </div>
                <FiChevronDown style={{color: '#64748b'}} />
              </div>
            </div>
          </header>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card card-problems">
              <div className="stat-icon">
                <FiTarget />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.totalSolved}</h3>
                <p className="stat-label">Problems Solved</p>
                <span className="stat-secondary">of {userStats.totalAttempted} attempted</span>
              </div>
            </div>

            <div className="stat-card card-acceptance">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.acceptanceRate}%</h3>
                <p className="stat-label">Acceptance Rate</p>
                <span className="stat-secondary">Keep it up!</span>
              </div>
            </div>

            <div className="stat-card card-streak">
              <div className="stat-icon">
                <FaFire />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.currentStreak} days</h3>
                <p className="stat-label">Current Streak</p>
                <span className="stat-secondary">Max: {userStats.maxStreak} days</span>
              </div>
            </div>

            <div className="stat-card card-activity">
              <div className="stat-icon">
                <FiTrendingUp />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.totalSubmissions}</h3>
                <p className="stat-label">Total Submissions</p>
                <span className="stat-secondary">all time</span>
              </div>
            </div>
          </div>

          {/* DIFFICULTY BREAKDOWN */}
          <div className="difficulty-section">
            <h2 className="section-title">Problems by Difficulty</h2>
            <div className="difficulty-cards">
              <div className="difficulty-card easy-card">
                <div className="difficulty-header">
                  <span className="difficulty-label">Easy</span>
                  <span className="difficulty-count">{userStats.easySolved}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill easy-fill" style={{width: `${(userStats.easySolved/50)*100}%`}}></div>
                </div>
                <span className="progress-text">{userStats.easySolved} / 50 solved</span>
              </div>

              <div className="difficulty-card medium-card">
                <div className="difficulty-header">
                  <span className="difficulty-label">Medium</span>
                  <span className="difficulty-count">{userStats.mediumSolved}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill medium-fill" style={{width: `${(userStats.mediumSolved/40)*100}%`}}></div>
                </div>
                <span className="progress-text">{userStats.mediumSolved} / 40 solved</span>
              </div>

              <div className="difficulty-card hard-card">
                <div className="difficulty-header">
                  <span className="difficulty-label">Hard</span>
                  <span className="difficulty-count">{userStats.hardSolved}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill hard-fill" style={{width: `${(userStats.hardSolved/20)*100}%`}}></div>
                </div>
                <span className="progress-text">{userStats.hardSolved} / 20 solved</span>
              </div>
            </div>
          </div>

          {/* RECENT SUBMISSIONS */}
          <div className="bottom-grid">
            <div className="recent-submissions-full">
              <div className="section-header">
                <h2 className="section-title">Recent Submissions</h2>
                <button className="view-all-btn" onClick={() => navigate('/profile/submissions')}>
                  View All
                </button>
              </div>
              <div className="submissions-list">
                {recentSubmissions.length === 0 ? (
                  <div className="empty-state">
                    <p>No submissions yet. Start solving problems!</p>
                    <button className="start-btn" onClick={() => navigate('/problems')}>
                      Browse Problems
                    </button>
                  </div>
                ) : (
                  recentSubmissions.map(sub => (
                    <div 
                      key={sub.id} 
                      className="submission-item clickable"
                      onClick={() => navigate(`/submissions/${sub.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="submission-main">
                        <h4 className="submission-problem">{sub.problem}</h4>
                        <div className="submission-meta">
                          <span className={`submission-status ${getStatusClass(sub.status)}`}>
                            {sub.status}
                          </span>
                          <span className="submission-lang">{sub.language}</span>
                          <span className={`submission-diff ${getDifficultyClass(sub.difficulty)}`}>
                            {sub.difficulty}
                          </span>
                        </div>
                      </div>
                      <span className="submission-time">{sub.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
