/**
 * Template Types and Interfaces
 * TypeScript definitions for note templates
 */

export interface ITemplate {
  _id?: string;
  userId?: string; // Optional: null for system templates
  name: string;
  description?: string;
  content: string; // HTML or JSON content
  category?: string;
  isPublic?: boolean; // System templates vs user templates
  isRichText?: boolean;
  variables?: string[]; // e.g., ["{{date}}", "{{user}}", "{{time}}"]
  thumbnail?: string;
  usageCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateDocument extends ITemplate {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
