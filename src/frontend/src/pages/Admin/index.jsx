import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiUsers, FiSend, FiSettings, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiChevronDown } from 'react-icons/fi';
import { FaUserShield, FaCode } from 'react-icons/fa';
import { getAdminStats, getUsers, updateUserRole, deleteUser, getProblemsAdmin, deleteProblem, getAllSubmissions } from '../../API/api-admin';
import { formatLanguage, formatStatus, formatMemory, getStatusClass } from '../../utils/format';
import './admin.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Users state
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(0);

    // Problems state
    const [problems, setProblems] = useState([]);
    const [problemsPage, setProblemsPage] = useState(0);
    const [problemSearch, setProblemSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('ALL');
    const [sortOpen, setSortOpen] = useState(false);

    // Submissions state
    const [submissions, setSubmissions] = useState([]);
    const [submissionsPage, setSubmissionsPage] = useState(0);
    const [submissionFilters, setSubmissionFilters] = useState({
        username: '',
        status: '',
        language: ''
    });

    const username = localStorage.getItem('username') || 'Admin';
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        // Check if user is admin
        if (userRole !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        loadStats();
    }, [userRole, navigate]);

    useEffect(() => {
        if (activeTab === 'dashboard') loadStats();
        if (activeTab === 'users') loadUsers();
        if (activeTab === 'problems') loadProblems();
        if (activeTab === 'submissions') loadSubmissions();
    }, [activeTab, usersPage, problemsPage, submissionsPage, problemSearch, submissionFilters]);

    // Real-time updates: Auto-refresh dashboard every 30 seconds
    useEffect(() => {
        if (activeTab === 'dashboard') {
            const interval = setInterval(() => {
                console.log('🔄 Auto-refreshing dashboard stats...');
                loadStats();
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const loadStats = async () => {
        try {
            const res = await getAdminStats();
            console.log('Stats response:', res.data);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
            console.error('Error details:', err.response?.data || err.message);
            alert('Failed to load stats: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            // Load all users for client-side pagination
            const res = await getUsers(0, 1000, 'id', 'asc');
            console.log('Users response:', res.data);
            setUsers(res.data.content || []);
        } catch (err) {
            console.error('Failed to load users:', err);
            console.error('Error details:', err.response?.data || err.message);
            alert('Failed to load users: ' + (err.response?.data?.error || err.message));
        }
    };

    const loadProblems = async () => {
        try {
            // Load all problems for client-side filtering/pagination
            const res = await getProblemsAdmin(0, 1000, '');
            console.log('Problems response:', res.data);
            setProblems(res.data.content || []);
        } catch (err) {
            console.error('Failed to load problems:', err);
            console.error('Error details:', err.response?.data || err.message);
            alert('Failed to load problems: ' + (err.response?.data?.error || err.message));
        }
    };

    const loadSubmissions = async () => {
        try {
            // Load submissions with filters
            const res = await getAllSubmissions(0, 1000, submissionFilters);
            console.log('Submissions response:', res.data);
            setSubmissions(res.data.content || []);
        } catch (err) {
            console.error('Failed to load submissions:', err);
            console.error('Error details:', err.response?.data || err.message);
            alert('Failed to load submissions: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        try {
            await updateUserRole(userId, newRole);
            loadUsers();
        } catch (err) {
            alert('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(userId);
            loadUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteProblem = async (problemId) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;
        try {
            await deleteProblem(problemId);
            loadProblems();
        } catch (err) {
            alert('Failed to delete problem');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        // Remove all theme classes from body
        document.body.classList.remove('theme-dark', 'theme-christmas', 'theme-newyear', 'theme-light');
        navigate('/login');
    };

    const getDifficultyClass = (diff) => {
        const d = diff?.toUpperCase();
        if (d === 'EASY') return 'easy';
        if (d === 'MEDIUM') return 'medium';
        if (d === 'HARD') return 'hard';
        return '';
    };

    const getDifficultyLabel = (d) => {
        const up = (d || '').toUpperCase();
        if (up === 'EASY') return 'Easy';
        if (up === 'MEDIUM') return 'Medium';
        if (up === 'HARD') return 'Hard';
        return 'All difficulties';
    };

    const ITEMS_PER_PAGE = 10;

    // ==================== PROBLEMS PAGINATION ====================
    // Filter problems by difficulty and search (client-side)
    const filteredProblems = useMemo(() => {
        let result = problems;

        // Filter by difficulty
        if (difficultyFilter !== 'ALL') {
            result = result.filter(p => p.difficulty?.toUpperCase() === difficultyFilter);
        }

        // Filter by search term
        if (problemSearch.trim()) {
            const search = problemSearch.toLowerCase().trim();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(search) ||
                p.id?.toString().includes(search)
            );
        }

        return result;
    }, [problems, difficultyFilter, problemSearch]);

    // Calculate pagination for filtered results
    const filteredTotalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

    // Get current page items
    const paginatedProblems = useMemo(() => {
        const start = problemsPage * ITEMS_PER_PAGE;
        return filteredProblems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProblems, problemsPage]);

    // Reset to page 0 when filter/search changes
    useEffect(() => {
        setProblemsPage(0);
    }, [difficultyFilter, problemSearch]);

    // ==================== USERS PAGINATION ====================
    const usersTotalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const start = usersPage * ITEMS_PER_PAGE;
        return users.slice(start, start + ITEMS_PER_PAGE);
    }, [users, usersPage]);

    // ==================== SUBMISSIONS PAGINATION ====================
    const submissionsTotalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);

    const paginatedSubmissions = useMemo(() => {
        const start = submissionsPage * ITEMS_PER_PAGE;
        return submissions.slice(start, start + ITEMS_PER_PAGE);
    }, [submissions, submissionsPage]);

    const sortLabel = difficultyFilter === 'ALL'
        ? 'All difficulties'
        : `Difficulty: ${getDifficultyLabel(difficultyFilter)}`;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString();
    };

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div className="admin-loading">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-top">
                        <div className="logo">
                            <span className="logo-uni">Uni</span>Code
                            <span className="admin-badge">Admin</span>
                        </div>
                        <nav className="nav-menu">
                            <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                                <FiGrid className="nav-icon" /> Dashboard
                            </button>
                            <button className={`nav-item ${activeTab === 'problems' ? 'active' : ''}`} onClick={() => setActiveTab('problems')}>
                                <FiFileText className="nav-icon" /> Problems
                            </button>
                            <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                                <FiUsers className="nav-icon" /> Users
                            </button>
                            <button className={`nav-item ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>
                                <FiSend className="nav-icon" /> Submissions
                            </button>
                        </nav>
                    </div>
                    <div className="sidebar-bottom">
                        <button className="nav-item" onClick={() => navigate('/settings')}>
                            <FiSettings className="nav-icon" /> Settings
                        </button>
                        <button className="nav-item" onClick={() => navigate('/dashboard')}>
                            <FiGrid className="nav-icon" /> User Dashboard
                        </button>
                        <button className="nav-item logout" onClick={handleLogout}>
                            <FiLogOut className="nav-icon" /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <header className="admin-header">
                        <div className="welcome-text">
                            <h1>
                                {activeTab === 'dashboard' && 'Admin Dashboard'}
                                {activeTab === 'problems' && 'Problem Management'}
                                {activeTab === 'users' && 'User Management'}
                                {activeTab === 'submissions' && 'All Submissions'}
                            </h1>
                            <p>Welcome back, {username}</p>
                        </div>
                        <div className="header-right">
                            <div className="user-avatar">
                                <FaUserShield />
                            </div>
                        </div>
                    </header>

                    <div className="admin-content">
                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && stats && (
                            <div className="dashboard-wrapper">
                                {/* Main Stats Grid */}
                                <div className="stats-grid">
                                    <div className="stat-card blue">
                                        <div className="stat-icon"><FiUsers /></div>
                                        <div className="stat-info">
                                            <h3>{stats.totalUsers}</h3>
                                            <p>Total Users</p>
                                        </div>
                                    </div>
                                    <div className="stat-card green">
                                        <div className="stat-icon"><FiFileText /></div>
                                        <div className="stat-info">
                                            <h3>{stats.totalProblems}</h3>
                                            <p>Problems</p>
                                        </div>
                                    </div>
                                    <div className="stat-card purple">
                                        <div className="stat-icon"><FiSend /></div>
                                        <div className="stat-info">
                                            <h3>{stats.totalSubmissions}</h3>
                                            <p>Submissions</p>
                                        </div>
                                    </div>
                                    <div className="stat-card orange">
                                        <div className="stat-icon"><FaUserShield /></div>
                                        <div className="stat-info">
                                            <h3>{stats.adminCount}</h3>
                                            <p>Admins</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Analytics Cards */}
                                <div className="analytics-grid">
                                    {/* Success Rate Card with CSS Chart */}
                                    <div className="analytics-card chart-card">
                                        <div className="card-header">
                                            <h3>Submission Statistics</h3>
                                            <span className="badge success">{stats.successRate}% Success</span>
                                        </div>
                                        <div className="card-body">
                                            {stats.submissionsByStatus && (() => {
                                                const total = stats.totalSubmissions || 1;
                                                const statuses = [
                                                    { name: 'Accepted', value: stats.submissionsByStatus.ACCEPTED || 0, color: '#52c41a' },
                                                    { name: 'Wrong Answer', value: stats.submissionsByStatus.WRONG_ANSWER || 0, color: '#f5222d' },
                                                    { name: 'Time Limit', value: stats.submissionsByStatus.TIME_LIMIT_EXCEEDED || 0, color: '#fa8c16' },
                                                    { name: 'Runtime Error', value: stats.submissionsByStatus.RUNTIME_ERROR || 0, color: '#722ed1' },
                                                    { name: 'Compile Error', value: stats.submissionsByStatus.COMPILATION_ERROR || 0, color: '#eb2f96' },
                                                    { name: 'Pending', value: stats.submissionsByStatus.PENDING || 0, color: '#faad14' }
                                                ].filter(item => item.value > 0);
                                                
                                                return (
                                                    <div className="css-chart-wrapper">
                                                        {/* Donut Chart */}
                                                        <div className="css-donut-chart">
                                                            <svg viewBox="0 0 100 100" className="donut-svg">
                                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#f0f0f0" strokeWidth="20" />
                                                                {(() => {
                                                                    let offset = 0;
                                                                    return statuses.map((status, index) => {
                                                                        const percentage = (status.value / total) * 100;
                                                                        const strokeDasharray = `${percentage * 2.2} ${220 - percentage * 2.2}`;
                                                                        const strokeDashoffset = -offset * 2.2;
                                                                        offset += percentage;
                                                                        return (
                                                                            <circle
                                                                                key={index}
                                                                                cx="50"
                                                                                cy="50"
                                                                                r="35"
                                                                                fill="none"
                                                                                stroke={status.color}
                                                                                strokeWidth="20"
                                                                                strokeDasharray={strokeDasharray}
                                                                                strokeDashoffset={strokeDashoffset}
                                                                                transform="rotate(-90 50 50)"
                                                                            />
                                                                        );
                                                                    });
                                                                })()}
                                                            </svg>
                                                            <div className="donut-center">
                                                                <div className="donut-percentage">{stats.successRate}%</div>
                                                                <div className="donut-label">Success</div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Legend */}
                                                        <div className="chart-legend">
                                                            {statuses.map((status, index) => (
                                                                <div key={index} className="legend-item">
                                                                    <div className="legend-color" style={{backgroundColor: status.color}}></div>
                                                                    <div className="legend-label">{status.name}</div>
                                                                    <div className="legend-value">{status.value}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            
                                            <div className="status-stats">
                                                <div className="status-row">
                                                    <span className="status-dot accepted"></span>
                                                    <span className="status-label">Accepted:</span>
                                                    <span className="status-value">{stats.acceptedSubmissions || 0}</span>
                                                </div>
                                                <div className="status-row">
                                                    <span className="status-dot wrong"></span>
                                                    <span className="status-label">Wrong Answer:</span>
                                                    <span className="status-value">{stats.wrongAnswerSubmissions || 0}</span>
                                                </div>
                                                <div className="status-row">
                                                    <span className="status-dot tle"></span>
                                                    <span className="status-label">Time Limit:</span>
                                                    <span className="status-value">{stats.timeLimitExceeded || 0}</span>
                                                </div>
                                                <div className="status-row">
                                                    <span className="status-dot rte"></span>
                                                    <span className="status-label">Runtime Error:</span>
                                                    <span className="status-value">{stats.runtimeError || 0}</span>
                                                </div>
                                                <div className="status-row">
                                                    <span className="status-dot ce"></span>
                                                    <span className="status-label">Compile Error:</span>
                                                    <span className="status-value">{stats.compilationError || 0}</span>
                                                </div>
                                                <div className="status-row">
                                                    <span className="status-dot pending"></span>
                                                    <span className="status-label">Pending:</span>
                                                    <span className="status-value">{stats.pendingSubmissions || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Card */}
                                    <div className="analytics-card">
                                        <div className="card-header">
                                            <h3>Activity</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="metric-row">
                                                <span className="metric-label">Active Users (7d)</span>
                                                <span className="metric-value">{stats.activeUsersThisWeek}</span>
                                            </div>
                                            <div className="metric-row">
                                                <span className="metric-label">Submissions Today</span>
                                                <span className="metric-value">{stats.submissionsToday}</span>
                                            </div>
                                            <div className="activity-percentage">
                                                {stats.totalUsers > 0 && (
                                                    <small>
                                                        {Math.round((stats.activeUsersThisWeek / stats.totalUsers) * 100)}% of users active
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Popular Problems & Recent Activity */}
                                <div className="dashboard-sections">
                                    {/* Popular Problems */}
                                    <div className="dashboard-section">
                                        <div className="section-header-simple">
                                            <h3>🔥 Popular Problems</h3>
                                        </div>
                                        <div className="popular-problems-list">
                                            {stats.popularProblems && stats.popularProblems.length > 0 ? (
                                                stats.popularProblems.map((problem, index) => (
                                                    <div key={problem.id} className="popular-problem-item">
                                                        <div className="problem-rank">#{index + 1}</div>
                                                        <div className="problem-info">
                                                            <div className="problem-title">{problem.title}</div>
                                                            <div className="problem-meta">
                                                                <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
                                                                    {problem.difficulty}
                                                                </span>
                                                                <span className="submission-count">
                                                                    {problem.submissionCount} submissions
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            className="btn-view-small" 
                                                            onClick={() => navigate(`/admin/problems/${problem.id}/edit`)}
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-state">No popular problems yet</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="dashboard-section">
                                        <div className="section-header-simple">
                                            <h3>⚡ Recent Activity</h3>
                                        </div>
                                        <div className="activity-feed">
                                            {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                                stats.recentActivity.map((activity) => (
                                                    <div key={activity.id} className="activity-item">
                                                        <div className={`activity-status ${getStatusClass(activity.status)}`}></div>
                                                        <div className="activity-content">
                                                            <div className="activity-main">
                                                                <strong>{activity.username}</strong> submitted{' '}
                                                                <span className="activity-problem">{activity.problemTitle}</span>
                                                            </div>
                                                            <div className="activity-meta">
                                                                <span className={`status-badge ${getStatusClass(activity.status)}`}>
                                                                    {formatStatus(activity.status)}
                                                                </span>
                                                                <span className="language-badge">{formatLanguage(activity.language)}</span>
                                                                <span className="activity-time">
                                                                    {formatTimeAgo(activity.submittedAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-state">No recent activity</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Problems Tab */}
                        {activeTab === 'problems' && (
                            <div className="problems-section">
                                <div className="section-header">
                                    <div className="search-box">
                                        <FiSearch />
                                        <input
                                            type="text"
                                            placeholder="Search problems..."
                                            value={problemSearch}
                                            onChange={(e) => setProblemSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="header-actions">
                                        {/* Difficulty Filter Dropdown */}
                                        <div className="sort-wrapper">
                                            <button
                                                className="sort-btn"
                                                onClick={() => setSortOpen((v) => !v)}
                                                type="button"
                                            >
                                                Sort By: {sortLabel} <FiChevronDown />
                                            </button>
                                            {sortOpen && (
                                                <div className="sort-dropdown">
                                                    {[
                                                        { key: 'ALL', label: 'All difficulties' },
                                                        { key: 'EASY', label: 'Easy' },
                                                        { key: 'MEDIUM', label: 'Medium' },
                                                        { key: 'HARD', label: 'Hard' },
                                                    ].map((opt) => (
                                                        <div
                                                            key={opt.key}
                                                            className={`sort-item ${difficultyFilter === opt.key ? 'active' : ''}`}
                                                            onClick={() => {
                                                                setDifficultyFilter(opt.key);
                                                                setSortOpen(false);
                                                            }}
                                                        >
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button className="btn-primary" onClick={() => navigate('/admin/problems/new')}>
                                            <FiPlus /> New Problem
                                        </button>
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table className="admin-table problems-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Difficulty</th>
                                                <th>Submissions</th>
                                                <th>Acceptance</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedProblems.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.id}</td>
                                                    <td>{p.title}</td>
                                                    <td><span className={`difficulty-badge ${getDifficultyClass(p.difficulty)}`}>{p.difficulty}</span></td>
                                                    <td>{p.totalSubmissions || 0}</td>
                                                    <td>{p.totalSubmissions > 0 ? `${p.acceptanceRate || 0}%` : 'N/A'}</td>
                                                    <td className="actions">
                                                        <button className="btn-icon" title="View" onClick={() => navigate(`/problem/${p.slug}`)}>
                                                            <FiEye />
                                                        </button>
                                                        <button className="btn-icon" title="Edit" onClick={() => navigate(`/admin/problems/${p.id}/edit`)}>
                                                            <FiEdit2 />
                                                        </button>
                                                        <button className="btn-icon danger" title="Delete" onClick={() => handleDeleteProblem(p.id)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Fill empty rows to maintain fixed height */}
                                            {paginatedProblems.length < ITEMS_PER_PAGE &&
                                                Array.from({ length: ITEMS_PER_PAGE - paginatedProblems.length }).map((_, i) => (
                                                    <tr key={`empty-${i}`} className="empty-row">
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-footer">
                                    <span className="results-count">
                                        Showing {paginatedProblems.length} of {filteredProblems.length} problems
                                    </span>
                                    <Pagination page={problemsPage} totalPages={filteredTotalPages} onPageChange={setProblemsPage} />
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="users-section">
                                <div className="table-container">
                                    <table className="admin-table users-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.id}</td>
                                                    <td>{u.username}</td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                            className={`role-select ${u.role === 'ADMIN' ? 'admin' : ''}`}
                                                        >
                                                            <option value="USER">USER</option>
                                                            <option value="ADMIN">ADMIN</option>
                                                        </select>
                                                    </td>
                                                    <td className="actions">
                                                        <button className="btn-icon danger" onClick={() => handleDeleteUser(u.id)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Fill empty rows to maintain fixed height */}
                                            {paginatedUsers.length < ITEMS_PER_PAGE &&
                                                Array.from({ length: ITEMS_PER_PAGE - paginatedUsers.length }).map((_, i) => (
                                                    <tr key={`empty-${i}`} className="empty-row">
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-footer">
                                    <span className="results-count">
                                        Showing {paginatedUsers.length} of {users.length} users
                                    </span>
                                    <Pagination page={usersPage} totalPages={usersTotalPages} onPageChange={setUsersPage} />
                                </div>
                            </div>
                        )}

                        {/* Submissions Tab */}
                        {activeTab === 'submissions' && (
                            <div className="submissions-section">
                                {/* Submissions Filter Bar */}
                                <div className="section-header submissions-filters">
                                    <div className="search-box">
                                        <FiSearch />
                                        <input
                                            type="text"
                                            placeholder="Search by username..."
                                            value={submissionFilters.username}
                                            onChange={(e) => setSubmissionFilters(prev => ({ ...prev, username: e.target.value }))}
                                        />
                                    </div>
                                    <div className="filter-group">
                                        <select
                                            value={submissionFilters.status}
                                            onChange={(e) => setSubmissionFilters(prev => ({ ...prev, status: e.target.value }))}
                                            className="filter-select"
                                        >
                                            <option value="">All Status</option>
                                            <option value="ACCEPTED">Accepted</option>
                                            <option value="WRONG_ANSWER">Wrong Answer</option>
                                            <option value="TIME_LIMIT_EXCEEDED">Time Limit</option>
                                            <option value="RUNTIME_ERROR">Runtime Error</option>
                                            <option value="COMPILATION_ERROR">Compile Error</option>
                                            <option value="PENDING">Pending</option>
                                        </select>
                                        <select
                                            value={submissionFilters.language}
                                            onChange={(e) => setSubmissionFilters(prev => ({ ...prev, language: e.target.value }))}
                                            className="filter-select"
                                        >
                                            <option value="">All Languages</option>
                                            <option value="CPP">C++</option>
                                            <option value="PYTHON">Python</option>
                                            <option value="JAVASCRIPT">JavaScript</option>
                                        </select>
                                        <button
                                            className="btn-secondary"
                                            onClick={() => setSubmissionFilters({ username: '', status: '', language: '' })}
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table className="admin-table submissions-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User</th>
                                                <th>Problem</th>
                                                <th>Language</th>
                                                <th>Status</th>
                                                <th>Runtime (ms)</th>
                                                <th>Memory (KB)</th>
                                                <th>Submitted</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSubmissions.map(s => (
                                                <tr key={s.id}>
                                                    <td>{s.id}</td>
                                                    <td>{s.user?.username || 'Unknown'}</td>
                                                    <td>{s.problem?.title || 'Unknown'}</td>
                                                    <td>{formatLanguage(s.language)}</td>
                                                    <td><span className={`status-badge ${getStatusClass(s.status)}`}>{formatStatus(s.status)}</span></td>
                                                    <td>{s.executionTimeMs != null ? s.executionTimeMs : '-'}</td>
                                                    <td>{s.memoryUsedKb != null ? s.memoryUsedKb : '-'}</td>
                                                    <td>{formatDate(s.submittedAt)}</td>
                                                    <td className="actions">
                                                        <button className="btn-icon" title="View Code" onClick={() => navigate(`/submissions/${s.id}`)}>
                                                            <FaCode />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Fill empty rows to maintain fixed height */}
                                            {paginatedSubmissions.length < ITEMS_PER_PAGE &&
                                                Array.from({ length: ITEMS_PER_PAGE - paginatedSubmissions.length }).map((_, i) => (
                                                    <tr key={`empty-${i}`} className="empty-row">
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-footer">
                                    <span className="results-count">
                                        Showing {paginatedSubmissions.length} of {submissions.length} submissions
                                    </span>
                                    <Pagination page={submissionsPage} totalPages={submissionsTotalPages} onPageChange={setSubmissionsPage} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button disabled={page === 0} onClick={() => onPageChange(page - 1)}>
                <FiChevronLeft />
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
                <FiChevronRight />
            </button>
        </div>
    );
}
