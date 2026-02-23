/**
 * Subscription Management API
 * GET: Fetch user subscription status
 * DELETE: Cancel subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/subscription
 * Get user's subscription details
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      'subscriptionTier subscriptionStatus stripeCustomerId stripeSubscriptionId subscriptionStartDate subscriptionEndDate'
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'active',
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        isPro: user.subscriptionTier === 'pro' && user.subscriptionStatus === 'active',
      },
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
