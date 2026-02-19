/**
 * Contact Form API
 * Handles contact form submissions and sends emails using Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/contact
 * Send contact form email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name (at least 2 characters)' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter a message (at least 10 characters)' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('⚠️ RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get recipient email (your email where messages should be sent)
    const recipientEmail = process.env.CONTACT_EMAIL || 'arincon73@gmail.com';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ThinkMate Contact <onboarding@resend.dev>', // Must be verified domain or use onboarding@resend.dev for testing
      to: [recipientEmail],
      replyTo: email,
      subject: `ThinkMate Contact Form: Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📬 New Contact Form Submission</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #16a34a;">
                <h2 style="margin-top: 0; color: #16a34a; font-size: 18px;">From:</h2>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h2 style="margin-top: 0; color: #3b82f6; font-size: 18px;">Message:</h2>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  💡 <strong>Tip:</strong> Click "Reply" to respond directly to ${email}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This message was sent from your ThinkMate contact form</p>
              <p style="margin: 5px 0 0 0;">
                Submitted on ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Contact form email sent successfully:', data?.id);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      emailId: data?.id,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
