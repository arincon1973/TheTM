'use client';

/**
 * Enhanced Note Editor Component
 * Full-featured note editor with all advanced capabilities
 */

import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import TagInput from '@/components/editor/TagInput';
import CategorySelector, { Category } from '@/components/editor/CategorySelector';
import FileUpload from '@/components/notes/FileUpload';
import AttachmentList from '@/components/notes/AttachmentList';
import ExportMenu from '@/components/notes/ExportMenu';
import ShareModal from '@/components/notes/ShareModal';
import VersionHistory from '@/components/notes/VersionHistory';

interface EnhancedNoteEditorProps {
  noteId?: string;
  initialNote?: any;
  onSave?: (note: any) => void;
  onClose?: () => void;
}

export default function EnhancedNoteEditor({
  noteId,
  initialNote,
  onSave,
  onClose,
}: EnhancedNoteEditorProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [isRichText, setIsRichText] = useState(initialNote?.isRichText ?? true);
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  const [categoryId, setCategoryId] = useState<string | undefined>(initialNote?.categoryId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'attachments' | 'versions'>('edit');

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (noteId) {
      fetchAttachments();
    }
  }, [noteId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.tags.map((t: any) => t.name));
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchAttachments = async () => {
    if (!noteId) return;
    try {
      const response = await fetch(`/api/attachments/${noteId}`);
      const data = await response.json();
      if (data.success) {
        setAttachments(data.attachments);
      }
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const noteData = {
        id: noteId,
        title,
        content,
        isRichText,
        tags,
        categoryId,
        prompt: initialNote?.prompt || 'Manual entry',
        action: initialNote?.action || 'notes',
      };

      const url = noteId ? '/api/notes' : '/api/notes';
      const method = noteId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (data.success) {
        if (onSave) {
          onSave(data.note);
        }
        alert('Note saved successfully!');
      } else {
        alert(data.error || 'Failed to save note');
      }
    } catch (error) {
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      const response = await fetch(`/api/attachments/${noteId}?id=${attachmentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchAttachments();
      } else {
        alert(data.error || 'Failed to delete attachment');
      }
    } catch (error) {
      alert('Failed to delete attachment');
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });

      const data = await response.json();

      if (data.success) {
        setTitle(data.note.title);
        setContent(data.note.content);
        alert('Version restored successfully!');
      } else {
        alert(data.error || 'Failed to restore version');
      }
    } catch (error) {
      alert('Failed to restore version');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {noteId ? 'Edit Note' : 'New Note'}
          </h2>
          <div className="flex items-center gap-2">
            {noteId && (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Share
                </button>
                <ExportMenu note={{ title, content, isRichText, tags, createdAt: initialNote?.createdAt }} />
              </>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Tabs - Sticky */}
        {noteId && (
          <div className="sticky top-[73px] z-10 flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'edit'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'attachments'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Attachments ({attachments.length})
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'versions'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Version History
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'edit' && (
            <div className="space-y-4">
              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full px-4 py-3 text-2xl font-bold border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  suggestions={availableTags}
                />
                <CategorySelector
                  value={categoryId}
                  onChange={setCategoryId}
                  categories={categories}
                />
              </div>

              {/* Editor Mode Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Editor Mode:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isRichText}
                    onChange={() => setIsRichText(false)}
                    className="text-green-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Plain Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isRichText}
                    onChange={() => setIsRichText(true)}
                    className="text-green-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Rich Text</span>
                </label>
              </div>

              {/* Content Editor */}
              {isRichText ? (
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your note..."
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note..."
                  className="w-full min-h-[400px] p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}

              {/* Quick Attachments Section for existing notes */}
              {noteId && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    📎 Attachments
                    {attachments.length > 0 && (
                      <span className="text-sm font-normal text-gray-500">({attachments.length})</span>
                    )}
                  </h3>
                  <FileUpload
                    noteId={noteId}
                    onUploadSuccess={() => fetchAttachments()}
                  />
                  {attachments.length > 0 && (
                    <div className="mt-4">
                      <AttachmentList
                        attachments={attachments.slice(0, 3)}
                        onDelete={handleDeleteAttachment}
                      />
                      {attachments.length > 3 && (
                        <button
                          onClick={() => setActiveTab('attachments')}
                          className="mt-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          View all {attachments.length} attachments →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Help message for new notes */}
              {!noteId && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Save your note first to access additional features like attachments, version history, and sharing.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attachments' && noteId && (
            <div className="space-y-4">
              <FileUpload
                noteId={noteId}
                onUploadSuccess={() => fetchAttachments()}
              />
              <AttachmentList
                attachments={attachments}
                onDelete={handleDeleteAttachment}
              />
            </div>
          )}

          {activeTab === 'versions' && noteId && (
            <VersionHistory
              noteId={noteId}
              onRestore={handleRestore}
            />
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && noteId && (
        <ShareModal
          noteId={noteId}
          onClose={() => setShowShareModal(false)}
          onShareCreated={(url) => {
            alert(`Share link created: ${url}`);
          }}
        />
      )}
    </div>
  );
}
