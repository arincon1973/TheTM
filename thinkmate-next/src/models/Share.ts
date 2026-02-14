/**
 * Share Model (Mongoose Schema)
 * Defines the share schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { IShare } from '@/types/share';

const shareSchema = new Schema<IShare>(
  {
    noteId: {
      type: String,
      required: [true, 'Note ID is required'],
      index: true,
    },
    sharedBy: {
      type: String,
      required: [true, 'Shared by user ID is required'],
      index: true,
    },
    sharedWith: {
      type: [String],
      default: [],
    },
    shareLink: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    permissions: {
      type: String,
      enum: ['view', 'comment', 'edit', 'admin'],
      default: 'view',
    },
    
    // Share settings
    expiresAt: {
      type: Date,
      index: true,
    },
    password: {
      type: String,
    },
    allowDownload: {
      type: Boolean,
      default: true,
    },
    allowPrint: {
      type: Boolean,
      default: true,
    },
    requireSignIn: {
      type: Boolean,
      default: false,
    },
    
    // Analytics
    views: {
      type: [{
        userId: String,
        viewedAt: { type: Date, default: Date.now },
        ipAddress: String,
      }],
      default: [],
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
shareSchema.index({ noteId: 1, isActive: 1 });
shareSchema.index({ sharedBy: 1, createdAt: -1 });
shareSchema.index({ shareLink: 1, isActive: 1 });
shareSchema.index({ expiresAt: 1, isActive: 1 });

// Prevent model overwrite upon initial compile in development
const Share: Model<IShare> =
  mongoose.models.Share || mongoose.model<IShare>('Share', shareSchema);

export default Share;
