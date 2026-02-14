/**
 * OpenAI API Client Configuration
 * Handles AI text generation using GPT-4
 */

import OpenAI from 'openai';

// Validate API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('⚠️ OPENAI_API_KEY is not set in environment variables');
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: apiKey || '',
});

/**
 * Generate text using GPT-4
 * @param prompt - User's text prompt
 * @param systemPrompt - Optional system prompt to guide AI behavior
 * @returns Generated text response
 */
export async function generateText(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant for note-taking. Generate clear, well-structured, and informative notes based on the user\'s prompt. Keep responses concise and actionable.'
): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    // Call OpenAI API with GPT-4o-mini (fast, cheap, available to all users)
    // To use GPT-4: Change model to 'gpt-4' after adding $5+ credits to your OpenAI account
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, affordable model available to all users
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract generated text
    const generatedText = completion.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error('No response generated from AI');
    }

    return generatedText;
  } catch (error: any) {
    // Handle specific OpenAI errors
    if (error?.error?.type === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }

    if (error?.error?.type === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }

    if (error?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }

    if (error?.status === 503) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again.');
    }

    // Re-throw with original message if it's already a custom error
    if (error.message) {
      throw error;
    }

    // Generic error
    throw new Error('Failed to generate text. Please try again.');
  }
}

/**
 * Generate structured notes based on a topic
 * @param topic - The topic for note generation
 * @returns Structured note content
 */
export async function generateNotes(topic: string): Promise<string> {
  const systemPrompt = `You are an expert note-taking assistant. Generate comprehensive, well-organized notes on the given topic. Use bullet points, headings, and clear structure. Keep the tone professional and informative.`;

  return generateText(topic, systemPrompt);
}

/**
 * Expand or elaborate on existing text
 * @param text - Text to expand
 * @returns Expanded text
 */
export async function expandText(text: string): Promise<string> {
  const systemPrompt = `You are a writing assistant. Expand and elaborate on the provided text, adding more detail, context, and clarity while maintaining the original meaning and tone.`;

  return generateText(`Expand this text: ${text}`, systemPrompt);
}

/**
 * Summarize text
 * @param text - Text to summarize
 * @returns Summarized text
 */
export async function summarizeText(text: string): Promise<string> {
  const systemPrompt = `You are a summarization expert. Create a concise, clear summary of the provided text, capturing the key points and main ideas.`;

  return generateText(`Summarize this text: ${text}`, systemPrompt);
}

export default openai;
