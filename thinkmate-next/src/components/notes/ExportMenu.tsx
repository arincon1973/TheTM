'use client';

/**
 * Export Menu Component
 * Dropdown menu for exporting notes
 */

import { useState } from 'react';
import {
  exportToPDF,
  exportToMarkdown,
  exportToHTML,
  exportToText,
  exportToJSON,
} from '@/lib/export';

interface ExportMenuProps {
  note: any;
  className?: string;
}

export default function ExportMenu({ note, className = '' }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string) => {
    setExporting(true);
    setIsOpen(false);

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(note);
          break;
        case 'markdown':
          exportToMarkdown(note);
          break;
        case 'html':
          exportToHTML(note);
          break;
        case 'text':
          exportToText(note);
          break;
        case 'json':
          exportToJSON(note);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {exporting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 flex items-center gap-3"
              >
                <span className="text-xl">📄</span>
                <div>
                  <div className="font-medium">Export as PDF</div>
                  <div className="text-xs text-gray-500">For printing</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 flex items-center gap-3"
              >
                <span className="text-xl">📝</span>
                <div>
                  <div className="font-medium">Export as Markdown</div>
                  <div className="text-xs text-gray-500">For GitHub, Obsidian</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('html')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 flex items-center gap-3"
              >
                <span className="text-xl">🌐</span>
                <div>
                  <div className="font-medium">Export as HTML</div>
                  <div className="text-xs text-gray-500">Web page</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('text')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 flex items-center gap-3"
              >
                <span className="text-xl">📃</span>
                <div>
                  <div className="font-medium">Export as Text</div>
                  <div className="text-xs text-gray-500">Plain text</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 flex items-center gap-3 border-t border-gray-200 dark:border-gray-700"
              >
                <span className="text-xl">💾</span>
                <div>
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-xs text-gray-500">Full data backup</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
