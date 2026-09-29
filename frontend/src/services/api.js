import axios from 'axios';

/**
 * Constructs the canonical backend API base URL.
 * Automatically respects VITE_API_URL if configured, strips trailing slashes,
 * and ensures single /api prefix.
 */
export function getApiBaseUrl() {
  const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!rawApiUrl) {
    return '/api';
  }
  const cleanUrl = rawApiUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

/**
 * Returns the backend interactive Swagger documentation URL.
 * Never hardcodes localhost in production builds.
 */
export function getApiDocsUrl() {
  const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!rawApiUrl) {
    return import.meta.env.DEV ? 'http://127.0.0.1:8000/docs' : '/docs';
  }
  const cleanUrl = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  return `${cleanUrl}/docs`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking /api/auth/me during initial boot
      const isAuthMe = error.config && error.config.url && error.config.url.includes('/auth/me');
      if (!isAuthMe) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
