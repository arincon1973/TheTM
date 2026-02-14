/**
 * Template Model (Mongoose Schema)
 * Defines the template schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { ITemplate } from '@/types/template';

const templateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      maxlength: [200, 'Template name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    content: {
      type: String,
      required: [true, 'Template content is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRichText: {
      type: Boolean,
      default: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
templateSchema.index({ userId: 1, name: 1 });
templateSchema.index({ isPublic: 1, category: 1 });
templateSchema.index({ usageCount: -1 });

// Prevent model overwrite upon initial compile in development
const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export default Template;
