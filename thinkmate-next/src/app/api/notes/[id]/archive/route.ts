/**
 * Archive Note API Route
 * Toggle archive status of a note
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
    const { isArchived } = body;

    await connectDB();

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: session.user.id,
      },
      { isArchived },
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
      message: isArchived ? 'Archived' : 'Unarchived',
    });

  } catch (error: any) {
    console.error('Update archive error:', error);
    return NextResponse.json(
      { error: 'Failed to update archive status' },
      { status: 500 }
    );
  }
}
