import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "");

export const api = axios.create({
  baseURL: BASE_URL,
  // only needed if you use cookies. You’re using Authorization Bearer, so keep false:
  withCredentials: false,
});

// helper to set/remove JWT header
export const setToken = (t) => {
  api.defaults.headers.common.Authorization = t ? `Bearer ${t}` : "";
};
