import axios from "axios";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
export const apiUrl = apiBaseUrl ? `${apiBaseUrl}/api` : undefined;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
