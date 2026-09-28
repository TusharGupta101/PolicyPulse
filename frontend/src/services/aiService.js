import api from './api';

export const aiService = {
  async explainEligibility(schemeId, resultId = null) {
    const res = await api.post('/ai/explain-eligibility', {
      scheme_id: schemeId,
      result_id: resultId
    });
    return res.data;
  },

  async recommendSchemes(category = null, targetUsers = null) {
    const res = await api.post('/ai/recommend-schemes', {
      category,
      target_users: targetUsers
    });
    return res.data;
  }
};
