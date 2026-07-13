import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    ownerId: {
      type: String,
      required: true,
      index: true
    },
    ownerEmail: {
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

export const Product = mongoose.model('Product', productSchema);
