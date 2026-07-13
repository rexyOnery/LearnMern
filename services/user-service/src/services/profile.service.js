import { Profile } from '../models/profile.model.js';

export const getOrCreateProfile = async (identity) => {
  const profile = await Profile.findOneAndUpdate(
    { authUserId: identity.id },
    {
      $setOnInsert: {
        authUserId: identity.id,
        email: identity.email,
        name: identity.name
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return profile;
};

export const updateProfile = async (identity, updates) => {
  const profile = await getOrCreateProfile(identity);

  if (updates.name !== undefined) {
    profile.name = updates.name;
  }

  if (updates.bio !== undefined) {
    profile.bio = updates.bio;
  }

  if (updates.location !== undefined) {
    profile.location = updates.location;
  }

  await profile.save();
  return profile;
};
