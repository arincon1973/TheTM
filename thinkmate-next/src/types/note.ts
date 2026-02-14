/**
 * Note Types and Interfaces
 * TypeScript definitions for note data structures
 */

export interface INote {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  prompt: string;
  action: 'generate' | 'notes' | 'expand' | 'summarize';
  
  // Rich text support
  isRichText?: boolean;
  
  // Tags and categories
  tags?: string[];
  categoryId?: string;
  
  // Organization
  isFavorite?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  color?: string;
  
  // Trash
  isDeleted?: boolean;
  deletedAt?: Date;
  
  // Metadata
  wordCount?: number;
  readTime?: number; // in minutes
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NoteDocument extends INote {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
