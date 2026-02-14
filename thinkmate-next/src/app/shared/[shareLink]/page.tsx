'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SharedNote {
  id: string;
  title: string;
  content: string;
  isRichText: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ShareInfo {
  permissions: 'view' | 'comment' | 'edit' | 'admin';
  requirePassword: boolean;
  requireSignIn: boolean;
  allowDownload: boolean;
  allowPrint: boolean;
}

export default function SharedNotePage() {
  const params = useParams();
  const shareLink = params.shareLink as string;
  const [note, setNote] = useState<SharedNote | null>(null);
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const fetchSharedNote = async (pwd?: string) => {
    try {
      setLoading(true);
      setError('');
      
      // First, try to get the note
      const response = await fetch(`/api/shared/${shareLink}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load shared note');
        return;
      }

      // Check if password is required
      if (data.share.requirePassword && !pwd) {
        setShowPasswordPrompt(true);
        setError('This shared note is password protected');
        setShareInfo(data.share);
        return;
      }

      // If password was provided, verify it
      if (pwd) {
        const verifyResponse = await fetch(`/api/shared/${shareLink}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          setError(verifyData.error || 'Invalid password');
          return;
        }
      }

      setNote(data.note);
      setShareInfo(data.share);
      setShowPasswordPrompt(false);
    } catch (err) {
      setError('Failed to load shared note');
      console.error('Error fetching shared note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareLink) {
      fetchSharedNote();
    }
  }, [shareLink]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      fetchSharedNote(password);
    }
  };

  const handleExport = async (format: 'pdf' | 'html' | 'txt' | 'md') => {
    if (!note) return;

    try {
      // Use the export utilities
      const { exportNote } = await import('@/lib/export');
      await exportNote(note, format);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error && !showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Note
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <svg
              className="w-16 h-16 text-blue-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This shared note is password protected
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Unlock Note
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {note.title}
              </h1>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {shareInfo?.allowDownload && (
              <div className="relative ml-4">
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {note.isRichText ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
              style={shareInfo?.allowPrint ? {} : { userSelect: 'none' }}
            />
          ) : (
            <div
              className="whitespace-pre-wrap text-gray-700 dark:text-gray-300"
              style={shareInfo?.allowPrint ? {} : { userSelect: 'none' }}
            >
              {note.content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Shared via ThinkMate
          </p>
          <a
            href="/"
            className="inline-block mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Create your own notes →
          </a>
        </div>
      </div>
    </div>
  );
}
