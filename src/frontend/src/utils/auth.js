// src/utils/auth.js
// Helper functions for authentication

// Save JWT token to localStorage
export function saveToken(token) {
  localStorage.setItem("jwt_token", token);
}

// Get JWT token from localStorage
export function getToken() {
  return localStorage.getItem("jwt_token");
}

// Remove JWT token from localStorage
export function removeToken() {
  localStorage.removeItem("jwt_token");
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}

// Save user info to localStorage
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Get user info from localStorage
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Remove user info from localStorage
export function removeUser() {
  localStorage.removeItem("user");
}

// Logout user (remove token and user info)
export function logout() {
  removeToken();
  removeUser();
}

export default {
  saveToken,
  getToken,
  removeToken,
  isAuthenticated,
  saveUser,
  getUser,
  removeUser,
  logout,
};
