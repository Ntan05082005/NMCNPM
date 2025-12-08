// src/API/api-login.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export function loginUser({ username, password }) {
  return API.post("/api/auth/login", {
    username,
    password,
  });
}

export default loginUser;
