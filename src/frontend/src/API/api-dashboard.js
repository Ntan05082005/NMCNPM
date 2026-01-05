// src/API/api-dashboard.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Add token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get dashboard statistics for current user
 * Returns user stats including:
 * - Total problems solved/attempted
 * - Acceptance rate
 * - Current streak
 * - Problems by difficulty
 * - Recent activity
 */
export function getDashboardStats(userId) {
  return API.get(`/api/submissions/stats/${userId}`);
}

/**
 * Get recent submissions for dashboard
 * Limited to last 5-10 submissions
 */
export function getRecentSubmissions(userId, limit = 5) {
  return API.get(`/api/submissions`, {
    params: {
      userId: userId,
      page: 0,
      size: limit
    }
  });
}

/**
 * Get recommended problems based on user's progress
 * TODO: Implement recommendation algorithm on backend
 */
export function getRecommendedProblems() {
  return API.get("/api/problems", {
    params: {
      page: 0,
      size: 4,
      sortBy: "likes",
      sortDirection: "DESC"
    }
  });
}

export default {
  getDashboardStats,
  getRecentSubmissions,
  getRecommendedProblems
};
