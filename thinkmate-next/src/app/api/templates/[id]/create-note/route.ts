/**
 * Create Note from Template API Route
 * Creates a new note from a template
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Template from '@/models/Template';
import Note from '@/models/Note';
import { format } from 'date-fns';

/**
 * POST /api/templates/[id]/create-note
 * Create a note from template
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

    const { id: templateId } = await params;
    const body = await request.json();
    const { title, variableValues } = body;

    await connectDB();

    // Get template
    const template = await Template.findOne({
      _id: templateId,
      $or: [
        { userId: session.user.id },
        { isPublic: true },
      ],
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Substitute variables
    let content = template.content;
    
    // Built-in variables
    const builtInVars: { [key: string]: string } = {
      '{{date}}': format(new Date(), 'MMMM dd, yyyy'),
      '{{time}}': format(new Date(), 'HH:mm'),
      '{{user}}': session.user.name || session.user.email || 'User',
      '{{datetime}}': format(new Date(), 'MMMM dd, yyyy HH:mm'),
    };

    // Replace built-in variables
    Object.entries(builtInVars).forEach(([key, value]) => {
      content = content.replace(new RegExp(key, 'g'), value);
    });

    // Replace custom variables if provided
    if (variableValues) {
      Object.entries(variableValues).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
      });
    }

    // Create note
    const note = await Note.create({
      userId: session.user.id,
      title: title || template.name,
      content,
      prompt: `Created from template: ${template.name}`,
      action: 'generate',
      isRichText: template.isRichText,
    });

    // Increment template usage count
    await Template.findByIdAndUpdate(templateId, {
      $inc: { usageCount: 1 },
    });

    return NextResponse.json({
      success: true,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        isRichText: note.isRichText,
        createdAt: note.createdAt,
      },
      message: 'Note created from template',
    });

  } catch (error: any) {
    console.error('Create note from template error:', error);
    return NextResponse.json(
      { error: 'Failed to create note from template' },
      { status: 500 }
    );
  }
}
