// src/API/mockapi.js
import axios from "axios";

export const mockApi = axios.create({
  baseURL: "https://69305e19778bbf9e00711385.mockapi.io",
});

export default {
  mockApi,
};
