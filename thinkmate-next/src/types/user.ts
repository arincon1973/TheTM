/**
 * User Types and Interfaces
 * TypeScript definitions for user data structures
 */

export interface IUser {
  _id?: string;
  email: string;
  password?: string; // Optional for OAuth users
  name?: string;
  image?: string;
  provider: 'email' | 'google';
  googleId?: string; // For Google OAuth users
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
