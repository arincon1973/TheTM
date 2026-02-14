/**
 * Trash Note API Route
 * Move note to trash or restore from trash
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

export async function PATCH(
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
    const { isDeleted } = body;

    await connectDB();

    const updateData: any = { isDeleted };
    if (isDeleted) {
      updateData.deletedAt = new Date();
    } else {
      updateData.deletedAt = null;
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: session.user.id,
      },
      updateData,
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
      message: isDeleted ? 'Moved to trash' : 'Restored from trash',
    });

  } catch (error: any) {
    console.error('Update trash error:', error);
    return NextResponse.json(
      { error: 'Failed to update trash status' },
      { status: 500 }
    );
  }
}
