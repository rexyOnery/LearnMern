import { Router } from 'express';
import { validate } from '@mern-microservices/shared';
import {
  getProducts,
  postProduct
} from '../controllers/product.controller.js';
import { requireIdentity } from '../middleware/identity.middleware.js';
import { createProductSchema } from '../validation/product.validation.js';

export const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', requireIdentity, validate(createProductSchema), postProduct);
