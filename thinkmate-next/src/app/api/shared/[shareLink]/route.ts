/**
 * Shared Note Access API Route
 * Allows accessing a shared note via share link
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Share from '@/models/Share';
import Note from '@/models/Note';
import bcrypt from 'bcryptjs';

/**
 * GET /api/shared/[shareLink]
 * Access a shared note
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareLink: string }> }
) {
  try {
    const { shareLink } = await params;

    await connectDB();

    // Find share
    const share = await Share.findOne({
      shareLink,
      isActive: true,
    });

    if (!share) {
      return NextResponse.json(
        { error: 'Share not found or expired' },
        { status: 404 }
      );
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Share link has expired' },
        { status: 410 }
      );
    }

    // Get note
    const note = await Note.findById(share.noteId);

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      share: {
        permissions: share.permissions,
        requirePassword: !!share.password,
        requireSignIn: share.requireSignIn,
        allowDownload: share.allowDownload,
        allowPrint: share.allowPrint,
      },
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        isRichText: note.isRichText,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });

  } catch (error: any) {
    console.error('Access shared note error:', error);
    return NextResponse.json(
      { error: 'Failed to access shared note' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shared/[shareLink]
 * Verify password for protected share
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareLink: string }> }
) {
  try {
    const { shareLink } = await params;
    const body = await request.json();
    const { password } = body;

    await connectDB();

    const share = await Share.findOne({
      shareLink,
      isActive: true,
    });

    if (!share || !share.password) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, share.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Record view
    await Share.findByIdAndUpdate(share._id, {
      $push: {
        views: {
          viewedAt: new Date(),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password verified',
    });

  } catch (error: any) {
    console.error('Verify share password error:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
