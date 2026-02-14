/**
 * Share API Route
 * Handles note sharing operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Share from '@/models/Share';
import Note from '@/models/Note';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

/**
 * GET /api/share
 * Get all shares created by the user
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

    const shares = await Share.find({
      sharedBy: session.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      shares,
    });

  } catch (error: any) {
    console.error('Fetch shares error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shares' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/share
 * Create a new share
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      noteId,
      sharedWith,
      permissions,
      expiresAt,
      password,
      allowDownload,
      allowPrint,
      requireSignIn,
    } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

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

    // Generate share link
    const shareLink = uuidv4();

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create share
    const share = await Share.create({
      noteId,
      sharedBy: session.user.id,
      sharedWith: sharedWith || [],
      shareLink,
      permissions: permissions || 'view',
      expiresAt,
      password: hashedPassword,
      allowDownload: allowDownload !== false,
      allowPrint: allowPrint !== false,
      requireSignIn: requireSignIn || false,
      views: [],
      isActive: true,
    });

    // Get the base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      success: true,
      share: {
        ...share.toObject(),
        password: undefined, // Don't send hashed password back
        shareUrl: `${baseUrl}/shared/${shareLink}`,
      },
      message: 'Share created successfully',
    });

  } catch (error: any) {
    console.error('Create share error:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/share
 * Update a share
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    // Hash password if provided in update
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await connectDB();

    const share = await Share.findOneAndUpdate(
      {
        _id: id,
        sharedBy: session.user.id,
      },
      updateData,
      { new: true }
    );

    if (!share) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      share: {
        ...share.toObject(),
        password: undefined,
      },
      message: 'Share updated successfully',
    });

  } catch (error: any) {
    console.error('Update share error:', error);
    return NextResponse.json(
      { error: 'Failed to update share' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/share?id=shareId
 * Revoke a share
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const share = await Share.findOneAndUpdate(
      {
        _id: shareId,
        sharedBy: session.user.id,
      },
      {
        isActive: false,
        revokedAt: new Date(),
      },
      { new: true }
    );

    if (!share) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Share revoked successfully',
    });

  } catch (error: any) {
    console.error('Delete share error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke share' },
      { status: 500 }
    );
  }
}
