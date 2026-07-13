import { api } from './api.js';

export const authService = {
  async register(payload) {
    const response = await api.post('/auth/register', payload);
    return response.data.data;
  },
  async login(payload) {
    const response = await api.post('/auth/login', payload);
    return response.data.data;
  },
  async validateToken() {
    const response = await api.get('/auth/validate');
    return response.data.data;
  }
};
