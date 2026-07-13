import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(1000),
  price: z.coerce.number().min(0)
});
