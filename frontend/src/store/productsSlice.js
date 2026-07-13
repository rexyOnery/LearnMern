import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../services/product.service.js';

export const fetchProducts = createAsyncThunk('products/fetch', async () =>
  productService.listProducts()
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload) => productService.createProduct(payload)
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    createStatus: 'idle',
    error: null,
    successMessage: null
  },
  reducers: {
    clearProductMessage(state) {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items = [action.payload, ...state.items];
        state.successMessage = 'Product created';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clearProductMessage } = productsSlice.actions;
export default productsSlice.reducer;
