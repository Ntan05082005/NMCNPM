// src/API/api-signup.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:8080
});

// Hàm gọi API đăng ký
export function registerUser(payload) {      // payload = { email, username, password } từ SignUp.jsx
  return API.post("/api/auth/register", {
    username: payload.username,
    password: payload.password,
    email: payload.email,
  });
}

