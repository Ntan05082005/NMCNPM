// src/API/api-problemdetail.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Get all problems with filters
export function getAllProblems({ page = 0, size = 10, difficulty, tags, search }) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  
  // Handle array of difficulties
  if (difficulty) {
    if (Array.isArray(difficulty)) {
      difficulty.forEach(d => params.append("difficulty", d));
    } else {
      params.append("difficulty", difficulty);
    }
  }
  
  // Handle array of tags
  if (tags) {
    if (Array.isArray(tags)) {
      tags.forEach(tag => params.append("tags", tag));
    } else {
      params.append("tags", tags);
    }
  }
  
  if (search) params.append("search", search);
  
  return API.get(`/api/problems?${params.toString()}`);
}

// Get problem by slug
export function getProblemBySlug(slug) {
  return API.get(`/api/problems/${slug}`);
}

// Get problem by ID
export function getProblemById(id) {
  return API.get(`/api/problems/id/${id}`);
}

// Get problem detail for coding interface with language-specific starter code
export function getProblemDetail(slug, language = "python") {
  const token = localStorage.getItem("jwt_token");
  
  const config = {
    params: { language }
  };
  
  // Add auth header if token exists (to get submission status)
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  }
  
  return API.get(`/api/problems/${slug}/detail`, config);
}

// Get all tags
export function getAllTags() {
  return API.get("/api/tags");
}

// Get tag by slug
export function getTagBySlug(slug) {
  return API.get(`/api/tags/${slug}`);
}

// Submit code solution
export function submitCode({ problemId, language, code }) {
  const token = localStorage.getItem("jwt_token");
  
  return API.post("/api/submissions", {
    problemId,
    language,
    code,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get user submissions
export function getUserSubmissions(userId) {
  const token = localStorage.getItem("jwt_token");
  
  return API.get(`/api/submissions/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get problem submissions
export function getProblemSubmissions(problemId) {
  const token = localStorage.getItem("jwt_token");
  
  return API.get(`/api/submissions/problem/${problemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default {
  getAllProblems,
  getProblemBySlug,
  getProblemById,
  getProblemDetail,
  getAllTags,
  getTagBySlug,
  submitCode,
  getUserSubmissions,
  getProblemSubmissions,
};
