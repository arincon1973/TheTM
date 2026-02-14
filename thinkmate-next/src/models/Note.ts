/**
 * Note Model (Mongoose Schema)
 * Defines the note schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { INote } from '@/types/note';

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
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
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
    },
    action: {
      type: String,
      required: true,
      enum: ['generate', 'notes', 'expand', 'summarize'],
      default: 'generate',
    },
    
    // Rich text support
    isRichText: {
      type: Boolean,
      default: false,
    },
    
    // Tags and categories
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    categoryId: {
      type: String,
      index: true,
    },
    
    // Organization
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
    
    // Trash
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    
    // Metadata
    wordCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
noteSchema.index({ userId: 1, createdAt: -1 }); // For fetching user's notes sorted by date
noteSchema.index({ userId: 1, isDeleted: 1 }); // For filtering deleted notes
noteSchema.index({ userId: 1, isFavorite: 1 }); // For favorites
noteSchema.index({ userId: 1, isArchived: 1 }); // For archived notes
noteSchema.index({ userId: 1, tags: 1 }); // For tag filtering
noteSchema.index({ userId: 1, categoryId: 1 }); // For category filtering
noteSchema.index({ createdAt: -1 }); // For general date sorting

// Prevent model overwrite upon initial compile in development
const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

export default Note;
