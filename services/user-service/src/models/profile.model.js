import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
