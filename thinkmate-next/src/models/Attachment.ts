/**
 * Attachment Model (Mongoose Schema)
 * Defines the attachment schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { IAttachment } from '@/types/attachment';

const attachmentSchema = new Schema<IAttachment>(
  {
    noteId: {
      type: String,
      required: [true, 'Note ID is required'],
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    category: {
      type: String,
      enum: ['document', 'image', 'video', 'audio', 'archive', 'other'],
      default: 'other',
    },
    thumbnailUrl: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'uploadedAt', updatedAt: false },
  }
);

// Create indexes for faster queries
attachmentSchema.index({ noteId: 1, uploadedAt: -1 });
attachmentSchema.index({ userId: 1, uploadedAt: -1 });
attachmentSchema.index({ userId: 1, category: 1 });

// Prevent model overwrite upon initial compile in development
const Attachment: Model<IAttachment> =
  mongoose.models.Attachment || mongoose.model<IAttachment>('Attachment', attachmentSchema);

export default Attachment;
