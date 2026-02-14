# OpenAI Integration Setup for ThinkMate

## Overview
ThinkMate now features AI-powered note-taking using OpenAI's GPT-4 API. Users can generate intelligent notes, expand text, create summaries, and get AI assistance with their writing.

## Features

### 1. AI Text Generation
- **Generate**: General-purpose text generation based on prompts
- **Create Notes**: Generate structured, well-organized notes on any topic
- **Expand**: Elaborate and add detail to existing text
- **Summarize**: Create concise summaries of long content

### 2. User Interface
- Clean, responsive form with Tailwind CSS styling
- Dark mode support (matches app theme)
- Real-time character count
- Loading states with spinner
- Error handling with user-friendly messages
- Copy to clipboard functionality
- Placeholder save button (for future database integration)

### 3. Security
- API key stored server-side in `.env.local`
- Server-side API route prevents key exposure
- Authentication required (must be signed in)
- Rate limiting ready
- Input validation (max 2000 characters)

## Setup Instructions

### Step 1: Get OpenAI API Key

1. **Sign Up / Sign In:**
   - Go to: https://platform.openai.com/
   - Create an account or sign in

2. **Create API Key:**
   - Navigate to: https://platform.openai.com/api-keys
   - Click "+ Create new secret key"
   - Give it a name (e.g., "ThinkMate Development")
   - Copy the key (starts with `sk-`)
   - ⚠️ **Important:** Save it immediately - you won't be able to see it again!

3. **Set Up Billing:**
   - Go to: https://platform.openai.com/account/billing
   - Add a payment method
   - Set usage limits to prevent unexpected charges
   - Recommended: Start with $5-10 for testing

### Step 2: Configure Environment Variables

1. **Open `.env.local`:**
   ```bash
   cd /Users/adrianarincon/playground/ai/my-other-project/thinkmate-next
   nano .env.local  # or use your preferred editor
   ```

2. **Add Your OpenAI API Key:**
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Save and close the file**

4. **Restart Development Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev -- --port 3003 --hostname 127.0.0.1
   ```

### Step 3: Verify Installation

1. **Check Dependencies:**
   ```bash
   npm list openai
   ```
   Should show: `openai@4.x.x` or similar

2. **Test the Feature:**
   - Navigate to: http://127.0.0.1:3003/auth/sign-in
   - Sign in with your account
   - Go to Dashboard
   - Scroll to "AI Note Generator" section
   - Enter a prompt (e.g., "Explain quantum computing")
   - Click "✨ Generate AI Text"
   - Should see AI-generated response!

## File Structure

```
thinkmate-next/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts          # API endpoint for AI generation
│   ├── components/
│   │   └── ui/
│   │       └── NoteForm.tsx          # AI note-taking form component
│   └── lib/
│       └── openai.ts                 # OpenAI client configuration
├── .env.local                        # Environment variables (API key)
└── OPENAI_SETUP.md                   # This file
```

## How It Works

### Architecture Flow

```
User Input (Dashboard)
    ↓
NoteForm.tsx (Client Component)
    ↓
POST /api/generate (API Route)
    ↓
openai.ts (OpenAI Client)
    ↓
OpenAI GPT-4 API
    ↓
Response Back to User
```

### 1. User Interaction (`NoteForm.tsx`)
- User enters a prompt
- Selects action type (Generate, Notes, Expand, Summarize)
- Clicks "Generate AI Text" button
- Form sends POST request to `/api/generate`

### 2. API Route (`/api/generate/route.ts`)
- Validates user is authenticated
- Validates prompt (not empty, max 2000 chars)
- Calls appropriate OpenAI function based on action type
- Returns generated text or error message

### 3. OpenAI Client (`openai.ts`)
- Initializes OpenAI SDK with API key
- Provides helper functions:
  - `generateText()` - General text generation
  - `generateNotes()` - Structured note creation
  - `expandText()` - Text expansion
  - `summarizeText()` - Text summarization
- Handles errors with user-friendly messages

## API Reference

### POST `/api/generate`

**Request Body:**
```json
{
  "prompt": "Your text prompt here",
  "action": "generate" | "notes" | "expand" | "summarize"
}
```

**Response (Success):**
```json
{
  "success": true,
  "text": "Generated AI response...",
  "prompt": "Original prompt",
  "action": "generate",
  "timestamp": "2026-02-11T12:34:56.789Z"
}
```

**Response (Error):**
```json
{
  "error": "Error message here",
  "details": "Additional details (dev mode only)"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (empty prompt, too long, etc.)
- `401` - Unauthorized (not signed in)
- `500` - Server error (OpenAI API failure, etc.)

## Error Handling

### Common Errors and Solutions

#### 1. "OpenAI API key is not configured"
**Cause:** API key missing from `.env.local`

**Solution:**
- Add `OPENAI_API_KEY=sk-your-key` to `.env.local`
- Restart dev server

#### 2. "Invalid OpenAI API key"
**Cause:** API key is incorrect or has been revoked

**Solution:**
- Generate a new API key at https://platform.openai.com/api-keys
- Update `.env.local` with the new key
- Restart dev server

#### 3. "OpenAI API quota exceeded"
**Cause:** You've used all your API credits

**Solution:**
- Go to: https://platform.openai.com/account/billing
- Add more credits to your account

#### 4. "Rate limit exceeded"
**Cause:** Too many requests in a short time

**Solution:**
- Wait a moment before trying again
- Consider implementing rate limiting on the client side

#### 5. "OpenAI service is temporarily unavailable"
**Cause:** OpenAI's servers are down or experiencing issues

**Solution:**
- Check OpenAI status: https://status.openai.com/
- Try again later

## Cost Estimates

### GPT-4 Pricing (as of 2026)
- **Input:** ~$0.03 per 1K tokens
- **Output:** ~$0.06 per 1K tokens

### Estimated Costs
- **Short prompt (100 tokens) + response (200 tokens):** ~$0.015
- **Medium prompt (500 tokens) + response (500 tokens):** ~$0.045
- **Long prompt (1000 tokens) + response (1000 tokens):** ~$0.09

### Budget Recommendations
- **Development:** $5-10/month (plenty for testing)
- **Light usage (100 requests/day):** $10-20/month
- **Moderate usage (500 requests/day):** $50-100/month

**Tip:** Set usage limits in OpenAI dashboard to prevent unexpected charges!

## Security Best Practices

### ✅ What We're Doing Right
1. **API Key Server-Side:** Key stored in `.env.local`, never exposed to client
2. **Authentication Required:** Users must sign in to use AI features
3. **Input Validation:** Max 2000 characters, non-empty validation
4. **Error Handling:** Sensitive errors not exposed to users
5. **Environment Variables:** `.env.local` in `.gitignore`

### 🔒 Additional Recommendations
1. **Rate Limiting:** Add rate limiting to prevent abuse
2. **Usage Monitoring:** Track API usage per user
3. **Cost Alerts:** Set up alerts in OpenAI dashboard
4. **Input Sanitization:** Already done, but monitor for edge cases
5. **Production Keys:** Use separate API keys for dev/staging/production

## Customization

### Changing AI Models

Edit `src/lib/openai.ts`:

```typescript
// Change from GPT-4 to GPT-3.5-turbo (cheaper, faster)
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',  // Instead of 'gpt-4'
  // ... rest of config
});
```

### Adjusting AI Behavior

Edit system prompts in `src/lib/openai.ts`:

```typescript
// Make AI more creative
temperature: 0.9,  // Higher = more creative (0.0 - 2.0)

// Make responses longer
max_tokens: 2000,  // Increase from 1000

// Make responses more focused
top_p: 0.9,  // Lower = more focused (0.0 - 1.0)
```

### Adding New Actions

1. **Add action type to `NoteForm.tsx`:**
   ```typescript
   <button onClick={() => setAction('translate')}>
     Translate
   </button>
   ```

2. **Create handler in `openai.ts`:**
   ```typescript
   export async function translateText(text: string, language: string) {
     const systemPrompt = `Translate the following text to ${language}...`;
     return generateText(text, systemPrompt);
   }
   ```

3. **Add case to API route:**
   ```typescript
   case 'translate':
     generatedText = await translateText(prompt, language);
     break;
   ```

## Testing

### Manual Testing Prompts

1. **General Generation:**
   ```
   Explain how photosynthesis works
   ```

2. **Create Notes:**
   ```
   Machine Learning Fundamentals
   ```

3. **Expand:**
   ```
   AI is changing the world
   ```

4. **Summarize:**
   ```
   [Paste a long article or text]
   ```

## Troubleshooting

### Dev Server Not Picking Up Changes

```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev -- --port 3003 --hostname 127.0.0.1
```

### API Key Not Working After Adding

1. Ensure no extra spaces in `.env.local`
2. Restart dev server completely
3. Check key starts with `sk-`
4. Verify key is active at https://platform.openai.com/api-keys

### Component Not Showing on Dashboard

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
3. Check browser console for errors
4. Verify you're signed in

## Future Enhancements

### Planned Features
- 💾 **Save to Database:** Store generated notes in MongoDB
- 📝 **Note History:** View previously generated notes
- 🎨 **Custom Templates:** Pre-built prompts for common tasks
- 🔊 **Voice Input:** Speak your prompts
- 📤 **Export:** Download notes as PDF/Markdown
- 🤝 **Collaboration:** Share notes with others
- 📊 **Usage Analytics:** Track AI generation statistics

## Support

If you encounter issues:

1. **Check Logs:**
   - Browser console (F12)
   - Server terminal output

2. **Verify Configuration:**
   - API key is set correctly
   - All dependencies installed
   - Server is running

3. **Common Fixes:**
   - Restart dev server
   - Clear browser cache
   - Check OpenAI status page

## Resources

- **OpenAI Documentation:** https://platform.openai.com/docs
- **OpenAI API Reference:** https://platform.openai.com/docs/api-reference
- **OpenAI Playground:** https://platform.openai.com/playground
- **Pricing:** https://openai.com/pricing
- **Status Page:** https://status.openai.com/

---

**🎉 Congratulations!** Your ThinkMate app now has AI-powered note-taking with OpenAI GPT-4!
