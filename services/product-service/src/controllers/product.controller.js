import { asyncHandler } from '@mern-microservices/shared';
import {
  createProduct,
  listProducts
} from '../services/product.service.js';

export const getProducts = asyncHandler(async (_req, res) => {
  const products = await listProducts();

  res.json({
    success: true,
    data: { products }
  });
});

export const postProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.identity, req.body);

  res.status(201).json({
    success: true,
    message: 'Product created',
    data: { product }
  });
});
