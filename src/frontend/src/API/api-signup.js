// src/API/api-signup.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Register new user
export function registerUser(payload) {
  return API.post("/api/auth/register", {
    username: payload.username,
    password: payload.password,
    email: payload.email,
  });
}

export default registerUser;
