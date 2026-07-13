import { api } from './api.js';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data.data.profile;
  },
  async updateProfile(payload) {
    const response = await api.patch('/users/profile', payload);
    return response.data.data.profile;
  }
};
