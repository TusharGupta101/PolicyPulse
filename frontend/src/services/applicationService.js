import api from './api';

export const applicationService = {
  async getApplications() {
    const res = await api.get('/applications');
    return res.data;
  },

  async submitApplication(data) {
    const res = await api.post('/applications', data);
    return res.data;
  }
};
