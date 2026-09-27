import api from './api';

export const eligibilityService = {
  async checkEligibility(schemeId = null) {
    const payload = schemeId ? { scheme_id: schemeId } : {};
    const res = await api.post('/eligibility/check', payload);
    return res.data;
  },

  async getResults() {
    const res = await api.get('/eligibility/results');
    return res.data;
  },

  async getResultById(id) {
    const res = await api.get(`/eligibility/${id}`);
    return res.data;
  }
};
