/**
 * Attachments API Route
 * Get and delete attachments for a note
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attachment from '@/models/Attachment';
import Note from '@/models/Note';
import { unlink } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

/**
 * GET /api/attachments/[noteId]
 * Get all attachments for a note
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { noteId } = await params;

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

    // Get attachments
    const attachments = await Attachment.find({ noteId })
      .sort({ uploadedAt: -1 });

    return NextResponse.json({
      success: true,
      attachments,
    });

  } catch (error: any) {
    console.error('Fetch attachments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attachments' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/attachments/[noteId]?id=attachmentId
 * Delete an attachment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('id');

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'Attachment ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get attachment
    const attachment = await Attachment.findOne({
      _id: attachmentId,
      userId: session.user.id,
    });

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = join(UPLOAD_DIR, attachment.filename);
      await unlink(filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
      // Continue even if file deletion fails
    }

    // Delete attachment record
    await Attachment.findByIdAndDelete(attachmentId);

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete attachment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete attachment' },
      { status: 500 }
    );
  }
}
