/**
 * Subscription Utilities
 * Helper functions for checking subscription status and feature access
 */

import { IUser } from '@/types/user';
import { PLAN_LIMITS } from './stripe';

/**
 * Check if user has Pro subscription
 */
export function isProUser(user: IUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.subscriptionTier === 'pro' &&
    user.subscriptionStatus === 'active'
  );
}

/**
 * Check if user can create more notes
 */
export function canCreateNote(user: IUser | null | undefined, currentNoteCount: number): boolean {
  if (!user) return false;
  
  const tier = user.subscriptionTier || 'free';
  const maxNotes = PLAN_LIMITS[tier].maxNotes;
  
  // -1 means unlimited
  if (maxNotes === -1) return true;
  
  return currentNoteCount < maxNotes;
}

/**
 * Check if user can use AI generation
 */
export function canUseAI(user: IUser | null | undefined, currentGenerationCount: number): boolean {
  if (!user) return false;
  
  const tier = user.subscriptionTier || 'free';
  const maxGenerations = PLAN_LIMITS[tier].maxAIGenerations;
  
  // -1 means unlimited
  if (maxGenerations === -1) return true;
  
  return currentGenerationCount < maxGenerations;
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(user: IUser | null | undefined, feature: string): boolean {
  if (!user) return false;
  
  const tier = user.subscriptionTier || 'free';
  const features = PLAN_LIMITS[tier].features;
  
  return features.includes(feature);
}

/**
 * Get remaining notes count
 */
export function getRemainingNotes(user: IUser | null | undefined, currentNoteCount: number): number | 'unlimited' {
  if (!user) return 0;
  
  const tier = user.subscriptionTier || 'free';
  const maxNotes = PLAN_LIMITS[tier].maxNotes;
  
  if (maxNotes === -1) return 'unlimited';
  
  return Math.max(0, maxNotes - currentNoteCount);
}

/**
 * Get subscription display name
 */
export function getSubscriptionDisplayName(user: IUser | null | undefined): string {
  if (!user) return 'Free';
  
  const tier = user.subscriptionTier || 'free';
  return tier === 'pro' ? 'Pro' : 'Free';
}

/**
 * Check if subscription is active and valid
 */
export function hasActiveSubscription(user: IUser | null | undefined): boolean {
  if (!user) return false;
  
  return (
    user.subscriptionTier === 'pro' &&
    (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing')
  );
}
