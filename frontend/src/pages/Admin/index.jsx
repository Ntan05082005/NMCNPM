import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiUsers, FiSend, FiSettings, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { FaUserShield, FaCode } from 'react-icons/fa';
import { getAdminStats, getUsers, updateUserRole, deleteUser, getProblemsAdmin, deleteProblem, getAllSubmissions } from '../../API/api-admin';
import './admin.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Users state
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(0);
    const [usersTotalPages, setUsersTotalPages] = useState(0);

    // Problems state
    const [problems, setProblems] = useState([]);
    const [problemsPage, setProblemsPage] = useState(0);
    const [problemsTotalPages, setProblemsTotalPages] = useState(0);
    const [problemSearch, setProblemSearch] = useState('');

    // Submissions state
    const [submissions, setSubmissions] = useState([]);
    const [submissionsPage, setSubmissionsPage] = useState(0);
    const [submissionsTotalPages, setSubmissionsTotalPages] = useState(0);

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
        if (activeTab === 'users') loadUsers();
        if (activeTab === 'problems') loadProblems();
        if (activeTab === 'submissions') loadSubmissions();
    }, [activeTab, usersPage, problemsPage, submissionsPage, problemSearch]);

    const loadStats = async () => {
        try {
            const res = await getAdminStats();
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await getUsers(usersPage, 10);
            setUsers(res.data.content || []);
            setUsersTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const loadProblems = async () => {
        try {
            const res = await getProblemsAdmin(problemsPage, 10, problemSearch);
            setProblems(res.data.content || []);
            setProblemsTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error('Failed to load problems:', err);
        }
    };

    const loadSubmissions = async () => {
        try {
            const res = await getAllSubmissions(submissionsPage, 15);
            setSubmissions(res.data.content || []);
            setSubmissionsTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error('Failed to load submissions:', err);
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
        navigate('/login');
    };

    const getDifficultyClass = (diff) => {
        const d = diff?.toUpperCase();
        if (d === 'EASY') return 'easy';
        if (d === 'MEDIUM') return 'medium';
        if (d === 'HARD') return 'hard';
        return '';
    };

    const getStatusClass = (status) => {
        if (status === 'ACCEPTED') return 'accepted';
        if (status === 'WRONG_ANSWER') return 'wrong';
        return 'pending';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString();
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
                                    <button className="btn-primary" onClick={() => navigate('/admin/problems/new')}>
                                        <FiPlus /> New Problem
                                    </button>
                                </div>
                                <table className="admin-table">
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
                                        {problems.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td>{p.title}</td>
                                                <td><span className={`difficulty-badge ${getDifficultyClass(p.difficulty)}`}>{p.difficulty}</span></td>
                                                <td>{p.totalSubmissions || 0}</td>
                                                <td>{p.acceptanceRate ? `${p.acceptanceRate}%` : 'N/A'}</td>
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
                                    </tbody>
                                </table>
                                <Pagination page={problemsPage} totalPages={problemsTotalPages} onPageChange={setProblemsPage} />
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="users-section">
                                <table className="admin-table">
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
                                        {users.map(u => (
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
                                    </tbody>
                                </table>
                                <Pagination page={usersPage} totalPages={usersTotalPages} onPageChange={setUsersPage} />
                            </div>
                        )}

                        {/* Submissions Tab */}
                        {activeTab === 'submissions' && (
                            <div className="submissions-section">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Problem</th>
                                            <th>Language</th>
                                            <th>Status</th>
                                            <th>Runtime</th>
                                            <th>Memory</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.id}</td>
                                                <td>{s.user?.username || 'Unknown'}</td>
                                                <td>{s.problem?.title || 'Unknown'}</td>
                                                <td>{s.language}</td>
                                                <td><span className={`status-badge ${getStatusClass(s.status)}`}>{s.status}</span></td>
                                                <td>{s.runtime ? `${s.runtime} ms` : 'N/A'}</td>
                                                <td>{s.memory ? `${(s.memory / 1024).toFixed(1)} MB` : 'N/A'}</td>
                                                <td>{formatDate(s.submittedAt)}</td>
                                                <td className="actions">
                                                    <button className="btn-icon" title="View Code" onClick={() => navigate(`/submissions/${s.id}`)}>
                                                        <FaCode />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination page={submissionsPage} totalPages={submissionsTotalPages} onPageChange={setSubmissionsPage} />
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
