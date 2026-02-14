/**
 * Enhanced Notes List Component with Advanced Features
 * Includes search, filters, tags, categories, and more
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AdvancedSearch from '@/components/notes/AdvancedSearch';
import ExportMenu from '@/components/notes/ExportMenu';
import ShareModal from '@/components/notes/ShareModal';
import AttachmentList from '@/components/notes/AttachmentList';
import VersionHistory from '@/components/notes/VersionHistory';

// Dynamically import the enhanced editor to avoid SSR issues
const EnhancedNoteEditor = dynamic(() => import('@/components/notes/EnhancedNoteEditor'), {
  ssr: false,
});

interface Note {
  _id: string;
  title: string;
  content: string;
  prompt: string;
  action: string;
  isRichText?: boolean;
  tags?: string[];
  categoryId?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Modal states
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewNoteEditor, setShowNewNoteEditor] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'archived'>('all');
  
  // View modal sidebar states
  const [viewSidebarTab, setViewSidebarTab] = useState<'attachments' | 'versions'>('attachments');
  const [viewAttachments, setViewAttachments] = useState<any[]>([]);

  /**
   * Fetch notes from API
   */
  const fetchNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notes');
      }

      const allNotes = data.notes || [];
      setNotes(allNotes);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
      console.error('Fetch notes error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch tags
   */
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.tags.map((t: any) => t.name));
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  /**
   * Fetch categories
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  /**
   * Apply view filter
   */
  useEffect(() => {
    let filtered = notes.filter(note => !note.isDeleted);
    
    if (viewMode === 'favorites') {
      filtered = filtered.filter(note => note.isFavorite);
    } else if (viewMode === 'archived') {
      filtered = filtered.filter(note => note.isArchived);
    } else {
      filtered = filtered.filter(note => !note.isArchived);
    }
    
    setFilteredNotes(filtered);
  }, [viewMode, notes]);

  /**
   * Handle search
   */
  const handleSearch = (filters: any) => {
    let filtered = [...notes].filter(note => !note.isDeleted);
    
    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(note =>
        filters.tags.some((tag: string) => note.tags?.includes(tag))
      );
    }
    
    // Apply category filter
    if (filters.categoryId) {
      filtered = filtered.filter(note => note.categoryId === filters.categoryId);
    }
    
    // Apply date range
    if (filters.dateFrom) {
      filtered = filtered.filter(note =>
        new Date(note.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(note =>
        new Date(note.createdAt) <= new Date(filters.dateTo)
      );
    }
    
    // Apply favorites filter
    if (filters.isFavorite !== undefined) {
      filtered = filtered.filter(note => note.isFavorite === filters.isFavorite);
    }
    
    // Apply archived filter
    if (filters.isArchived !== undefined) {
      filtered = filtered.filter(note => note.isArchived === filters.isArchived);
    } else if (viewMode === 'all') {
      filtered = filtered.filter(note => !note.isArchived);
    }
    
    setFilteredNotes(filtered);
  };

  /**
   * Open view modal
   */
  const handleViewNote = async (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
    setViewSidebarTab('attachments');
    
    // Fetch attachments for the note
    try {
      const response = await fetch(`/api/attachments/${note._id}`);
      const data = await response.json();
      if (data.success) {
        setViewAttachments(data.attachments || []);
      }
    } catch (err) {
      console.error('Failed to fetch attachments:', err);
      setViewAttachments([]);
    }
  };

  /**
   * Open edit modal
   */
  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  /**
   * Handle note saved from editor
   */
  const handleNoteSaved = (updatedNote: any) => {
    fetchNotes();
    setIsEditModalOpen(false);
    setSelectedNote(null);
  };

  /**
   * Toggle favorite
   */
  const handleToggleFavorite = async (noteId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentState }),
      });
      
      if (response.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  /**
   * Toggle archive
   */
  const handleToggleArchive = async (noteId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !currentState }),
      });
      
      if (response.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to toggle archive:', err);
    }
  };

  /**
   * Delete a note
   */
  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete note');
      }

      // Remove note from list
      setNotes(notes.filter(note => note._id !== noteId));
      setIsViewModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedNote(null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
      console.error('Delete error:', err);
    }
  };

  /**
   * Close modals
   */
  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedNote(null);
    setError('');
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Get action badge styling
   */
  const getActionBadge = (action: string) => {
    const badges = {
      notes: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: '📝 Notes' },
      expand: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', label: '🔍 Expand' },
      summarize: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', label: '📄 Summary' },
      generate: { bg: 'bg-gray-100 dark:bg-gray-800/50', text: 'text-gray-800 dark:text-gray-300', label: '✨ Generate' },
    };
    return badges[action as keyof typeof badges] || badges.generate;
  };

  // Fetch data on mount
  useEffect(() => {
    fetchNotes();
    fetchTags();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your notes...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Advanced Features Banner */}
      <div className="w-full max-w-6xl mx-auto mb-4">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-1">✨ Advanced Features Enabled!</h3>
          <p className="text-sm opacity-90">
            Search, filter, tag, export, share, and use rich text editor - Click any note to explore all features
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Search and Filters */}
        {availableTags && categories && (
          <AdvancedSearch
            onSearch={handleSearch}
            availableTags={availableTags}
            availableCategories={categories}
          />
        )}

        {/* Main Content */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          {/* Header with View Tabs */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📚 Your Notes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewNoteEditor(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Note with Tags
                </button>
                <button
                  onClick={fetchNotes}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                All Notes
              </button>
              <button
                onClick={() => setViewMode('favorites')}
                className={`px-4 py-2 font-medium transition-colors ${
                  viewMode === 'favorites'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                ⭐ Favorites
              </button>
              <button
                onClick={() => setViewMode('archived')}
                className={`px-4 py-2 font-medium transition-colors ${
                  viewMode === 'archived'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                📦 Archived
              </button>
            </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg">
              {notes.length === 0 ? 'No notes yet' : 'No notes found'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {notes.length === 0 
                ? 'Generate and save AI notes to see them here!'
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const badge = getActionBadge(note.action);
              return (
                <div
                  key={note._id}
                  className="group relative border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 bg-white dark:bg-gray-800/50 hover:border-green-500 dark:hover:border-green-600"
                  style={{ backgroundColor: note.color }}
                >
                  {/* Top badges and actions */}
                  <div className="absolute top-3 right-3 flex gap-2 items-center">
                    {note.isPinned && <span title="Pinned">📌</span>}
                    {note.isFavorite && <span title="Favorite">⭐</span>}
                    {note.isArchived && <span title="Archived">📦</span>}
                    {note.isRichText && (
                      <span 
                        title="Rich Text Format" 
                        className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full font-medium"
                      >
                        RT
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text} font-medium`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Click to view */}
                  <div onClick={() => handleViewNote(note)} className="cursor-pointer">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 pr-20 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {note.title}
                    </h3>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Content Preview */}
                    {note.isRichText ? (
                      <div 
                        className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 prose prose-sm dark:prose-invert max-w-none [&>*]:my-0 [&_p]:my-0 [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-sm [&_h4]:text-sm [&_h5]:text-sm [&_h6]:text-sm [&_ul]:my-0 [&_ol]:my-0 [&_li]:my-0"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                        {note.content}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span>{formatDate(note.createdAt)}</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Quick Actions (show on hover) */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(note._id, !!note.isFavorite);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {note.isFavorite ? '⭐' : '☆'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleArchive(note._id, !!note.isArchived);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      title={note.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      📦
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModals}>
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex" onClick={(e) => e.stopPropagation()}>
            
            {/* Main Content - Left Side */}
            <div className="flex-1 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedNote.title}
                  </h2>
                  
                  {/* Tags */}
                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedNote.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 items-center flex-wrap">
                    {(() => {
                      const badge = getActionBadge(selectedNote.action);
                      return (
                        <span className={`text-xs px-2 py-1 rounded ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                    {selectedNote.isRichText && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        Rich Text
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {formatDate(selectedNote.createdAt)}
                    </span>
                    {selectedNote.updatedAt && selectedNote.updatedAt !== selectedNote.createdAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • Updated: {formatDate(selectedNote.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Prompt:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  "{selectedNote.prompt}"
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Content:</h3>
                {selectedNote.isRichText ? (
                  <div 
                    className="text-gray-900 dark:text-white prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                  />
                ) : (
                  <div className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {selectedNote.content}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-2 justify-between flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleFavorite(selectedNote._id, !!selectedNote.isFavorite)}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    selectedNote.isFavorite
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                  }`}
                  title={selectedNote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {selectedNote.isFavorite ? '⭐' : '☆'}
                </button>
                <button
                  onClick={() => handleToggleArchive(selectedNote._id, !!selectedNote.isArchived)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                  title={selectedNote.isArchived ? 'Unarchive' : 'Archive'}
                >
                  📦 {selectedNote.isArchived ? 'Unarchive' : 'Archive'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedNote.content)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <ExportMenu note={selectedNote} />
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setIsViewModalOpen(false);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                <button
                  onClick={() => handleEditClick(selectedNote)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedNote._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
            </div>

            {/* Right Sidebar - Attachments & Version History */}
            <div className="w-96 border-l border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Sidebar Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewSidebarTab('attachments')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    viewSidebarTab === 'attachments'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  📎 Attachments ({viewAttachments.length})
                </button>
                <button
                  onClick={() => setViewSidebarTab('versions')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    viewSidebarTab === 'versions'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  🕐 History
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {viewSidebarTab === 'attachments' ? (
                  viewAttachments.length > 0 ? (
                    <AttachmentList
                      attachments={viewAttachments}
                      onDelete={async (attachmentId) => {
                        try {
                          const response = await fetch(`/api/attachments/${selectedNote._id}?id=${attachmentId}`, {
                            method: 'DELETE',
                          });
                          if (response.ok) {
                            setViewAttachments(prev => prev.filter(a => a._id !== attachmentId));
                          }
                        } catch (err) {
                          console.error('Failed to delete attachment:', err);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No attachments</p>
                      <p className="text-xs mt-2">Edit the note to add attachments</p>
                    </div>
                  )
                ) : (
                  <VersionHistory
                    noteId={selectedNote._id}
                    onRestore={async (versionId) => {
                      try {
                        const response = await fetch(`/api/notes/${selectedNote._id}/restore`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ versionId }),
                        });
                        const data = await response.json();
                        if (data.success) {
                          fetchNotes();
                          setIsViewModalOpen(false);
                          alert('Version restored successfully!');
                        }
                      } catch (err) {
                        console.error('Failed to restore version:', err);
                        alert('Failed to restore version');
                      }
                    }}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Modal - Full Featured Editor */}
      {isEditModalOpen && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="my-8 w-full max-w-7xl">
            <EnhancedNoteEditor
              noteId={selectedNote._id}
              initialNote={selectedNote}
              onSave={handleNoteSaved}
              onClose={closeModals}
            />
          </div>
        </div>
      )}

      {/* New Note Editor */}
      {showNewNoteEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="my-8 w-full max-w-7xl">
            <EnhancedNoteEditor
              onSave={(note) => {
                fetchNotes();
                setShowNewNoteEditor(false);
              }}
              onClose={() => setShowNewNoteEditor(false)}
            />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedNote && (
        <ShareModal
          noteId={selectedNote._id}
          onClose={() => {
            setShowShareModal(false);
            setSelectedNote(null);
          }}
          onShareCreated={(url) => {
            alert(`Share link created: ${url}`);
          }}
        />
      )}
    </>
  );
}
