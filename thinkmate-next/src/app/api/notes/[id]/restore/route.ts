/**
 * Note Version Restore API
 * POST /api/notes/[id]/restore - Restore a note to a specific version
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteVersion from '@/models/NoteVersion';

/**
 * POST /api/notes/[id]/restore
 * Restore note to a specific version
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify note ownership
    const note = await Note.findOne({ _id: id, userId: session.user.id });
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Get the version to restore
    const version = await NoteVersion.findOne({
      _id: versionId,
      noteId: id,
      userId: session.user.id,
    });

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Save current version before restoring
    const latestVersion = await NoteVersion.findOne({ noteId: id })
      .sort({ version: -1 })
      .select('version');

    const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

    await NoteVersion.create({
      noteId: id,
      userId: session.user.id,
      title: note.title,
      content: note.content,
      isRichText: note.isRichText,
      version: nextVersion,
    });

    // Restore the note
    note.title = version.title;
    note.content = version.content;
    note.isRichText = version.isRichText;
    await note.save();

    return NextResponse.json({
      success: true,
      message: `Note restored to version ${version.version}`,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        isRichText: note.isRichText,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
