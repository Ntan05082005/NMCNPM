import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
    withCredentials: true
});

// Add auth token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== DASHBOARD ====================

export const getAdminStats = () => API.get('/api/admin/stats');

// ==================== USER MANAGEMENT ====================

export const getUsers = (page = 0, size = 10, sortBy = 'id', direction = 'asc') =>
    API.get(`/api/admin/users?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);

export const updateUserRole = (userId, role) =>
    API.put(`/api/admin/users/${userId}/role`, { role });

export const deleteUser = (userId) =>
    API.delete(`/api/admin/users/${userId}`);

// ==================== PROBLEM MANAGEMENT ====================

export const getProblemsAdmin = (page = 0, size = 10, search = '') =>
    API.get(`/api/admin/problems?page=${page}&size=${size}${search ? `&search=${search}` : ''}`);

export const getProblemById = (problemId) =>
    API.get(`/api/admin/problems/${problemId}`);

export const createProblem = (problemData) =>
    API.post('/api/admin/problems', problemData);

export const updateProblem = (problemId, problemData) =>
    API.put(`/api/admin/problems/${problemId}`, problemData);

export const deleteProblem = (problemId) =>
    API.delete(`/api/admin/problems/${problemId}`);

export const getTestCases = (problemId) =>
    API.get(`/api/admin/problems/${problemId}/testcases`);

// ==================== SUBMISSIONS ====================

export const getAllSubmissions = (page = 0, size = 20, filters = {}) => {
    let url = `/api/admin/submissions?page=${page}&size=${size}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.language) url += `&language=${filters.language}`;
    if (filters.username) url += `&username=${encodeURIComponent(filters.username)}`;
    if (filters.problemId) url += `&problemId=${filters.problemId}`;
    if (filters.userId) url += `&userId=${filters.userId}`;
    return API.get(url);
};

export const getAcceptedSolutions = (problemId) =>
    API.get(`/api/admin/problems/${problemId}/solutions`);

// ==================== TAGS ====================

export const getAllTags = () => API.get('/api/admin/tags');

export default API;
