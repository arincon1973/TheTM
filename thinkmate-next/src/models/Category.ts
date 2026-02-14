/**
 * Category Model (Mongoose Schema)
 * Defines the category schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '@/types/category';

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    parentId: {
      type: String,
      index: true,
    },
    color: {
      type: String,
      default: '#16a34a',
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
categorySchema.index({ userId: 1, name: 1 }, { unique: true });
categorySchema.index({ userId: 1, parentId: 1 });
categorySchema.index({ userId: 1, order: 1 });

// Prevent model overwrite upon initial compile in development
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
