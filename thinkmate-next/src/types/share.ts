/**
 * Share Types and Interfaces
 * TypeScript definitions for note sharing
 */

export type PermissionLevel = 'view' | 'comment' | 'edit' | 'admin';

export interface IShare {
  _id?: string;
  noteId: string;
  sharedBy: string; // User ID
  sharedWith?: string[]; // User IDs (for specific users)
  shareLink?: string; // UUID for public/link sharing
  permissions: PermissionLevel;
  
  // Share settings
  expiresAt?: Date;
  password?: string; // Hashed
  allowDownload?: boolean;
  allowPrint?: boolean;
  requireSignIn?: boolean;
  
  // Analytics
  views?: {
    userId?: string;
    viewedAt: Date;
    ipAddress?: string;
  }[];
  
  // Status
  isActive?: boolean;
  revokedAt?: Date;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShareDocument extends IShare {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
