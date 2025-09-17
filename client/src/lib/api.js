import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "");

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // <-- important for cookie-based auth (localhost & prod)
});

// Attach Bearer token if we saved one (optional, keeps both flows working)
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const setToken = (t) => {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
};
