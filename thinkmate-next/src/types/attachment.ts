/**
 * Attachment Types and Interfaces
 * TypeScript definitions for file attachments
 */

export interface IAttachment {
  _id?: string;
  noteId: string;
  userId: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  fileType: string; // MIME type
  fileSize: number; // in bytes
  category: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: any;
  };
  uploadedAt?: Date;
}

export interface AttachmentDocument extends IAttachment {
  _id: string;
  uploadedAt: Date;
}
