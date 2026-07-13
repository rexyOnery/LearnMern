import { api } from './api.js';

export const productService = {
  async listProducts() {
    const response = await api.get('/products');
    return response.data.data.products;
  },
  async createProduct(payload) {
    const response = await api.post('/products', payload);
    return response.data.data.product;
  }
};
