/**
 * User Model (Mongoose Schema)
 * Defines the user schema for MongoDB
 */

import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types/user';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password is required only for email provider
        return this.provider === 'email';
      },
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
      enum: ['email', 'google'],
      default: 'email',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    
    // Subscription fields
    subscriptionTier: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'],
      default: 'active',
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Prevent model overwrite upon initial compile in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
