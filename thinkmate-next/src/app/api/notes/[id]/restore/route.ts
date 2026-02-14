/**
 * Note Restore API Route
 * Restore a note from a version
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteVersion from '@/models/NoteVersion';

/**
 * POST /api/notes/[id]/restore
 * Restore note from a version
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: noteId } = await params;
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get version
    const version = await NoteVersion.findOne({
      _id: versionId,
      noteId,
      userId: session.user.id,
    });

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Update note
    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: session.user.id,
      },
      {
        title: version.title,
        content: version.content,
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note,
      message: 'Note restored successfully',
    });

  } catch (error: any) {
    console.error('Restore note error:', error);
    return NextResponse.json(
      { error: 'Failed to restore note' },
      { status: 500 }
    );
  }
}
