import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from sessionStorage when available.
// This acts as a fallback for cross-origin deployments (Vercel + Render) where
// browsers block third-party HttpOnly cookies. The cookie is still sent via
// withCredentials when the browser allows it.
client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('disasterconnect_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
