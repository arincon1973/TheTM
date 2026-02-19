/**
 * NoteVersion Model
 * Stores historical versions of notes for version control
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface INoteVersion {
  noteId: string;
  userId: string;
  version: number;
  title: string;
  content: string;
  isRichText: boolean;
  createdAt: Date;
}

export interface NoteVersionDocument extends INoteVersion, Document {}

const NoteVersionSchema = new Schema<NoteVersionDocument>(
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
    version: {
      type: Number,
      required: [true, 'Version number is required'],
      min: 1,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    isRichText: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient version queries
NoteVersionSchema.index({ noteId: 1, version: -1 });
NoteVersionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.NoteVersion ||
  mongoose.model<NoteVersionDocument>('NoteVersion', NoteVersionSchema);
