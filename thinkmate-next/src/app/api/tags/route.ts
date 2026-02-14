/**
 * Tags API Route
 * Handles tag operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

/**
 * GET /api/tags
 * Get all unique tags for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all unique tags from user's notes
    const notes = await Note.find({
      userId: session.user.id,
      isDeleted: { $ne: true },
    }).select('tags');

    // Flatten and get unique tags with counts
    const tagMap = new Map<string, number>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagMap.entries()).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      tags,
    });

  } catch (error: any) {
    console.error('Fetch tags error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
