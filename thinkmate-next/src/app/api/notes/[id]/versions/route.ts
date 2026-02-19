/**
 * Note Version History API
 * GET /api/notes/[id]/versions - Get version history for a note
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteVersion from '@/models/NoteVersion';

/**
 * GET /api/notes/[id]/versions
 * Fetch version history for a specific note
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    // Verify note ownership
    const note = await Note.findOne({ _id: id, userId: session.user.id });
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found or you do not have permission to view it' },
        { status: 404 }
      );
    }

    // Fetch all versions for this note
    const versions = await NoteVersion.find({ noteId: id })
      .sort({ version: -1 })
      .limit(50) // Limit to last 50 versions
      .lean();

    return NextResponse.json({
      success: true,
      versions: versions.map((v) => ({
        id: v._id.toString(),
        version: v.version,
        title: v.title,
        content: v.content,
        isRichText: v.isRichText,
        createdAt: v.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}
