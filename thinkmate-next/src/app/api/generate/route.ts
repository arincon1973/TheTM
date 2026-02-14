/**
 * AI Text Generation API Route
 * Handles OpenAI API requests securely on the server
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateText, generateNotes, expandText, summarizeText } from '@/lib/openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to use AI features.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, action = 'generate' } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate prompt length (max 2000 characters)
    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 2000 characters allowed.' },
        { status: 400 }
      );
    }

    let generatedText: string;

    // Handle different actions
    switch (action) {
      case 'notes':
        generatedText = await generateNotes(prompt);
        break;
      
      case 'expand':
        generatedText = await expandText(prompt);
        break;
      
      case 'summarize':
        generatedText = await summarizeText(prompt);
        break;
      
      case 'generate':
      default:
        generatedText = await generateText(prompt);
        break;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      text: generatedText,
      prompt: prompt,
      action: action,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('AI generation error:', error);

    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate text. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
