/**
 * Note Version Types and Interfaces
 * TypeScript definitions for version history
 */

export interface INoteVersion {
  _id?: string;
  noteId: string;
  userId: string;
  title: string;
  content: string;
  version: number;
  label?: string; // e.g., "Final Draft", "Initial Version"
  comment?: string;
  changes?: {
    added: number;
    removed: number;
  };
  createdAt?: Date;
}

export interface NoteVersionDocument extends INoteVersion {
  _id: string;
  createdAt: Date;
}
