/**
 * Note Versions API Route
 * Handles version history for notes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteVersion from '@/models/NoteVersion';

/**
 * GET /api/notes/[id]/versions
 * Get all versions for a note
 */
export async function GET(
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

    await connectDB();

    // Verify note belongs to user
    const note = await Note.findOne({
      _id: noteId,
      userId: session.user.id,
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Get all versions
    const versions = await NoteVersion.find({ noteId })
      .sort({ version: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      versions,
    });

  } catch (error: any) {
    console.error('Fetch versions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes/[id]/versions
 * Create a new version snapshot
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
    const { label, comment } = body;

    await connectDB();

    // Get note
    const note = await Note.findOne({
      _id: noteId,
      userId: session.user.id,
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Get latest version number
    const latestVersion = await NoteVersion.findOne({ noteId })
      .sort({ version: -1 })
      .select('version');

    const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;

    // Create version
    const version = await NoteVersion.create({
      noteId,
      userId: session.user.id,
      title: note.title,
      content: note.content,
      version: newVersionNumber,
      label,
      comment,
    });

    return NextResponse.json({
      success: true,
      version,
      message: 'Version saved successfully',
    });

  } catch (error: any) {
    console.error('Create version error:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}
