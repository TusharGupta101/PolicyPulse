import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data.access_token) {
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};
