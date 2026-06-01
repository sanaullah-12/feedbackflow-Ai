import { create } from 'zustand';
import api, { API_URL } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('ff_token') || null,
  loading: true,
  initialized: false,
  error: null,

  initialize: async () => {
    try {
      const token = localStorage.getItem('ff_token');
      
      // No token - user is not authenticated
      if (!token) {
        set({ user: null, token: null, loading: false, initialized: true, error: null });
        return;
      }

      // Token exists - verify it's still valid
      const { data } = await api.get('/auth/me');
      set({ 
        user: data.user, 
        token, 
        loading: false, 
        initialized: true, 
        error: null 
      });
    } catch (err) {
      // Token is invalid or expired
      localStorage.removeItem('ff_token');
      set({ 
        user: null, 
        token: null, 
        loading: false, 
        initialized: true, 
        error: err.response?.data?.error || 'Authentication failed' 
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post(`${API_URL}/auth/login`, { email, password });
      
      // Store token before setting state to ensure it's available for requests
      localStorage.setItem('ff_token', data.token);
      
      set({ 
        user: data.user, 
        token: data.token,
        loading: false,
        initialized: true,
        error: null
      });
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      set({ 
        loading: false, 
        error: errorMsg 
      });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post(`${API_URL}/auth/signup`, { name, email, password });
      
      // Store token before setting state
      localStorage.setItem('ff_token', data.token);
      
      set({ 
        user: data.user, 
        token: data.token,
        loading: false,
        initialized: true,
        error: null
      });
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Signup failed';
      set({ 
        loading: false, 
        error: errorMsg 
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('ff_token');
    set({ 
      user: null, 
      token: null,
      loading: false,
      initialized: true,
      error: null
    });
  },

  updateUser: (updates) => {
    set(state => ({ user: { ...state.user, ...updates } }));
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, error: null });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to refresh user' });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
