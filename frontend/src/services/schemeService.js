import api from './api';

export const schemeService = {
  async getSchemes(params = {}) {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  async getScheme(id) {
    const res = await api.get(`/schemes/${id}`);
    return res.data;
  }
};
