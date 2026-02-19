/**
 * Notes API Route
 * Handles CRUD operations for user notes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

/**
 * GET /api/notes
 * Fetch all notes for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch user's notes, sorted by most recent first
    const notes = await Note.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 most recent notes

    return NextResponse.json({
      success: true,
      notes,
      count: notes.length,
    });

  } catch (error: any) {
    console.error('Fetch notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes
 * Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save notes.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content, prompt, action = 'generate' } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Auto-generate title if not provided
    let noteTitle = title;
    if (!noteTitle || noteTitle.trim().length === 0) {
      // Generate title from prompt (first 50 chars)
      noteTitle = prompt.length > 50 
        ? prompt.substring(0, 47) + '...'
        : prompt;
    }

    // Validate title length
    if (noteTitle.length > 200) {
      noteTitle = noteTitle.substring(0, 197) + '...';
    }

    // Connect to database
    await connectDB();

    // Create note
    const note = await Note.create({
      userId: session.user.id,
      title: noteTitle,
      content: content.trim(),
      prompt: prompt.trim(),
      action,
    });

    return NextResponse.json({
      success: true,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        prompt: note.prompt,
        action: note.action,
        createdAt: note.createdAt,
      },
      message: 'Note saved successfully!',
    });

  } catch (error: any) {
    console.error('Save note error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save note. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notes
 * Update an existing note
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { id, title, content, isRichText, tags, categoryId } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate title if provided
    let noteTitle = title;
    if (noteTitle && noteTitle.length > 200) {
      noteTitle = noteTitle.substring(0, 197) + '...';
    }

    // Connect to database
    await connectDB();

    // Get the current note before updating to save as a version
    const currentNote = await Note.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!currentNote) {
      return NextResponse.json(
        { error: 'Note not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Save current version before updating (if content has changed)
    if (currentNote.content !== content.trim() || currentNote.title !== noteTitle) {
      try {
        // Import NoteVersion model
        const NoteVersion = (await import('@/models/NoteVersion')).default;
        
        // Get the latest version number
        const latestVersion = await NoteVersion.findOne({ noteId: id })
          .sort({ version: -1 })
          .select('version');
        
        const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

        // Create version snapshot
        await NoteVersion.create({
          noteId: id,
          userId: session.user.id,
          title: currentNote.title,
          content: currentNote.content,
          version: nextVersion,
          label: 'Auto-saved',
        });
      } catch (versionError) {
        console.error('Failed to create version:', versionError);
        // Continue with update even if version creation fails
      }
    }

    // Update note
    const updateData: any = {
      title: noteTitle || undefined,
      content: content.trim(),
    };

    // Add optional fields if provided
    if (isRichText !== undefined) updateData.isRichText = isRichText;
    if (tags !== undefined) updateData.tags = tags;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      updateData,
      {
        new: true, // Return updated document
        runValidators: true,
      }
    );

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        prompt: note.prompt,
        action: note.action,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
      message: 'Note updated successfully!',
    });

  } catch (error: any) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update note. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes
 * Delete a note by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Get note ID from query params
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find and delete note (only if it belongs to the user)
    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: session.user.id,
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Failed to delete note. Please try again.' },
      { status: 500 }
    );
  }
}
