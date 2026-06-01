import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

const api = axios.create({
  baseURL: '',
  timeout: 60000,
});

// Request interceptor - attach token
api.interceptors.request.use(config => {
  const rawUrl = config.url || '';
  const isAbsolute = /^https?:\/\//i.test(rawUrl);
  const alreadyPrefixed = rawUrl.startsWith(API_URL);
  if (!isAbsolute && !alreadyPrefixed) {
    const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    config.url = `${API_URL}${normalizedPath}`;
  }

  const token = localStorage.getItem('ff_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ff_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
