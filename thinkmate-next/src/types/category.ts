/**
 * Category Types and Interfaces
 * TypeScript definitions for note categories
 */

export interface ICategory {
  _id?: string;
  userId: string;
  name: string;
  parentId?: string; // For hierarchical categories
  color?: string;
  icon?: string;
  description?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDocument extends ICategory {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
