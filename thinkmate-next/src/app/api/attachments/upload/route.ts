/**
 * File Upload API Route
 * Handles file uploads for note attachments
 * Note: This implementation uses base64 encoding for file storage
 * For production, consider using AWS S3, Cloudinary, or UploadThing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attachment from '@/models/Attachment';
import Note from '@/models/Note';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

/**
 * POST /api/attachments/upload
 * Upload a file attachment
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const noteId = formData.get('noteId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
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

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    
    // Ensure upload directory exists
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(UPLOAD_DIR, filename);
    await writeFile(filePath, buffer);

    // Determine file category
    const fileType = file.type;
    let category: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other' = 'other';
    
    if (fileType.startsWith('image/')) category = 'image';
    else if (fileType.startsWith('video/')) category = 'video';
    else if (fileType.startsWith('audio/')) category = 'audio';
    else if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('word') || fileType.includes('text')) category = 'document';
    else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) category = 'archive';

    // Create attachment record
    const attachment = await Attachment.create({
      noteId,
      userId: session.user.id,
      filename,
      originalName: file.name,
      fileUrl: `/uploads/${filename}`,
      fileType: file.type,
      fileSize: file.size,
      category,
    });

    return NextResponse.json({
      success: true,
      attachment,
      message: 'File uploaded successfully',
    });

  } catch (error: any) {
    console.error('Upload file error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
