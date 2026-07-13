import { Product } from '../models/product.model.js';

export const listProducts = async () =>
  Product.find().sort({ createdAt: -1 }).limit(50);

export const createProduct = async (identity, productInput) =>
  Product.create({
    ...productInput,
    ownerId: identity.id,
    ownerEmail: identity.email
  });
