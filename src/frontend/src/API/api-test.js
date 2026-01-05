import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// API public
export function callPublic() {
  return API.get("/api/test/public");
}

// API cần JWT
export function callProtected() {
  const token = localStorage.getItem("jwt_token");

  return API.get("/api/test/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default {
  callPublic,
  callProtected,
};
