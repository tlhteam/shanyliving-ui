import axios from "axios";

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const fallbackApiBaseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "https://api.shanyliving.com";

export const apiBaseUrl = configuredApiBaseUrl || fallbackApiBaseUrl;
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
