import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getUserProfile() {
  return API.get("/api/users/profile");
}

export function updateUserProfile(data) {
  return API.put("/api/users/profile", data);
}