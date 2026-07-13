import { asyncHandler } from '@mern-microservices/shared';
import {
  getOrCreateProfile,
  updateProfile
} from '../services/profile.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile(req.identity);

  res.json({
    success: true,
    data: { profile }
  });
});

export const patchProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.identity, req.body);

  res.json({
    success: true,
    message: 'Profile updated',
    data: { profile }
  });
});
