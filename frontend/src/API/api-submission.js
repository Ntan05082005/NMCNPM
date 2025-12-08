// src/API/api-submission.js
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

// Submit code solution
export function submitCode({ problemId, language, code }) {
  return API.post("/api/submissions", {
    problemId,
    language,
    code,
  });
}

// Get user submissions
export function getUserSubmissions(userId) {
  return API.get(`/api/submissions/user/${userId}`);
}

// Get problem submissions
export function getProblemSubmissions(problemId) {
  return API.get(`/api/submissions/problem/${problemId}`);
}

export default {
  submitCode,
  getUserSubmissions,
  getProblemSubmissions,
};
