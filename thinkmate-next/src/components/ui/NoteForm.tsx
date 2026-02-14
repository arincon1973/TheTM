/**
 * AI Note-Taking Form Component
 * Allows users to generate AI-powered notes using OpenAI GPT-4
 */

'use client';

import { useState } from 'react';

export default function NoteForm() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [action, setAction] = useState<'generate' | 'notes' | 'expand' | 'summarize'>('generate');

  /**
   * Handle text generation
   */
  const handleGenerate = async () => {
    // Validation
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (prompt.length > 2000) {
      setError('Prompt is too long. Maximum 2000 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate text');
      }

      setGeneratedText(data.text);
    } catch (err: any) {
      setError(err.message || 'Failed to generate text. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle save to database
   */
  const handleSave = async () => {
    if (!generatedText.trim()) {
      setError('No text to save');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '', // Will be auto-generated from prompt
          content: generatedText.trim(),
          prompt: prompt.trim(),
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save note');
      }

      setSuccessMessage('✅ Note saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save note. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Clear form
   */
  const handleClear = () => {
    setPrompt('');
    setGeneratedText('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ✨ AI Note Generator
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate intelligent notes, summaries, and expanded content using AI
        </p>
      </div>

      {/* Action Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Action
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAction('generate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              action === 'generate'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-pressed={action === 'generate'}
          >
            Generate
          </button>
          <button
            onClick={() => setAction('notes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              action === 'notes'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-pressed={action === 'notes'}
          >
            Create Notes
          </button>
          <button
            onClick={() => setAction('expand')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              action === 'expand'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-pressed={action === 'expand'}
          >
            Expand
          </button>
          <button
            onClick={() => setAction('summarize')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              action === 'summarize'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-pressed={action === 'summarize'}
          >
            Summarize
          </button>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            action === 'notes'
              ? 'Enter a topic for notes (e.g., "Quantum Physics Basics")'
              : action === 'expand'
              ? 'Enter text to expand...'
              : action === 'summarize'
              ? 'Enter text to summarize...'
              : 'Enter your prompt here...'
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          rows={5}
          maxLength={2000}
          aria-label="Prompt input"
          aria-describedby="prompt-help"
          disabled={loading}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span id="prompt-help">Maximum 2000 characters</span>
          <span>{prompt.length}/2000</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400 dark:text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed"
          aria-label={loading ? 'Generating...' : 'Generate AI text'}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : (
            '✨ Generate AI Text'
          )}
        </button>
      </div>

      {/* Generated Text Display */}
      {generatedText && (
        <div className="mb-4">
          <label
            htmlFor="generated-text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Generated Text
          </label>
          <div
            id="generated-text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-y-auto"
            role="region"
            aria-label="Generated text output"
          >
            {generatedText}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 flex-wrap">
            <button
              onClick={handleSave}
              disabled={saving || !generatedText.trim()}
              className="flex-1 min-w-[200px] px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed"
              aria-label="Save generated text"
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                '💾 Save Note'
              )}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(generatedText)}
              className="flex-1 min-w-[200px] px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Copy to clipboard"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={handleClear}
              className="flex-1 min-w-[200px] px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-label="Clear form"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Tips for Better Results
        </h3>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Be specific and clear in your prompts</li>
          <li>Use "Create Notes" for structured topic summaries</li>
          <li>Use "Expand" to add more detail to existing text</li>
          <li>Use "Summarize" to condense long content</li>
          <li>The AI uses GPT-4 for high-quality responses</li>
        </ul>
      </div>
    </div>
  );
}
