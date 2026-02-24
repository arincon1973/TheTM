/**
 * AI Generation Count API
 * Returns the number of AI-generated notes for the current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

/**
 * GET /api/notes/ai-count
 * Get count of AI-generated notes for current user
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

    // Count notes with a prompt (AI-generated notes)
    const count = await Note.countDocuments({
      userId: session.user.id,
      prompt: { $exists: true, $ne: '' }
    });

    return NextResponse.json({
      success: true,
      count,
      limit: 5,
      remaining: Math.max(0, 5 - count),
    });
  } catch (error: any) {
    console.error('AI count fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI generation count' },
      { status: 500 }
    );
  }
}
