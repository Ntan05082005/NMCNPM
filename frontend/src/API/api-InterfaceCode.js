// InterfaceCode.js - API for Coding Interface
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

/**
 * Get problem detail with language-specific starter code for coding interface
 * @param {string} slug - Problem slug (e.g., "two-sum")
 * @param {string} language - Programming language: "python", "javascript", or "cpp"
 * @returns {Promise} Response with full problem details including:
 *   - id, slug, title, category, timeLimit
 *   - description (full HTML)
 *   - examples[] (input, output, explanation)
 *   - constraints[]
 *   - defaultCode { language, code }
 *   - submissionStatus (if user is logged in)
 */
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

/**
 * Submit code solution for a problem
 * @param {number} problemId - Problem ID
 * @param {string} language - Programming language: "python", "javascript", or "cpp"
 * @param {string} code - User's code solution
 * @returns {Promise} Response with:
 *   - status: "ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", etc.
 *   - testCasesPassed: number
 *   - totalTestCases: number
 *   - executionTimeMs: number
 *   - testResults[] - detailed results for each test case
 *   - errorMessage: string (if any)
 */
export function submitCode({ problemId, language, code }) {
  const token = localStorage.getItem("jwt_token");
  
  if (!token) {
    return Promise.reject(new Error("Please login to submit code"));
  }
  
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

/**
 * Run code without submitting (test with sample cases only)
 * @param {number} problemId - Problem ID
 * @param {string} language - Programming language
 * @param {string} code - User's code
 * @returns {Promise} Test results
 */
export function runCode({ problemId, language, code }) {
  const token = localStorage.getItem("jwt_token");
  
  if (!token) {
    return Promise.reject(new Error("Please login to run code"));
  }
  
  return API.post("/api/submissions/run", {
    problemId,
    language,
    code,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get user's submission history for a specific problem
 * @param {number} problemId - Problem ID
 * @returns {Promise} List of user submissions
 */
export function getProblemSubmissions(problemId) {
  const token = localStorage.getItem("jwt_token");
  
  if (!token) {
    return Promise.reject(new Error("Please login to view submissions"));
  }
  
  return API.get(`/api/submissions/problem/${problemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get all user submissions
 * @param {number} userId - User ID
 * @returns {Promise} List of all user submissions
 */
export function getUserSubmissions(userId) {
  const token = localStorage.getItem("jwt_token");
  
  if (!token) {
    return Promise.reject(new Error("Please login to view submissions"));
  }
  
  return API.get(`/api/submissions/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get submission by ID
 * @param {number} submissionId - Submission ID
 * @returns {Promise} Submission details
 */
export function getSubmissionById(submissionId) {
  const token = localStorage.getItem("jwt_token");
  
  if (!token) {
    return Promise.reject(new Error("Please login to view submission"));
  }
  
  return API.get(`/api/submissions/${submissionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Export all functions
export default {
  getProblemDetail,
  submitCode,
  runCode,
  getProblemSubmissions,
  getUserSubmissions,
  getSubmissionById,
};
