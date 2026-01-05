// src/API/api-ai.js
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
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @param {string} context - Optional context (problem details, code, etc.)
 * @returns {Promise} - API response with { success, reply, error }
 */
export const sendChatMessage = async (message, context = null) => {
    return API.post('/api/ai/chat', {
        message,
        context
    });
};

/**
 * Check if AI service is available
 * @returns {Promise} - API response
 */
export const checkAIHealth = async () => {
    return API.get('/api/ai/health');
};
