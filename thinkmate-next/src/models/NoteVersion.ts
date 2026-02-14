/**
 * Note Version Model (Mongoose Schema)
 * Defines the note version schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { INoteVersion } from '@/types/version';

const noteVersionSchema = new Schema<INoteVersion>(
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
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    version: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    changes: {
      added: { type: Number, default: 0 },
      removed: { type: Number, default: 0 },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Create indexes for faster queries
noteVersionSchema.index({ noteId: 1, version: -1 });
noteVersionSchema.index({ noteId: 1, createdAt: -1 });
noteVersionSchema.index({ userId: 1, createdAt: -1 });

// Prevent model overwrite upon initial compile in development
const NoteVersion: Model<INoteVersion> =
  mongoose.models.NoteVersion || mongoose.model<INoteVersion>('NoteVersion', noteVersionSchema);

export default NoteVersion;
