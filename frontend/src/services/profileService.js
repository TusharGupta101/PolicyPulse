import api from './api';

export const profileService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  }
};
