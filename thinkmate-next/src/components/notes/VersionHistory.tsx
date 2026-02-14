'use client';

/**
 * Version History Component
 * Display and manage note versions
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Version {
  _id: string;
  version: number;
  title: string;
  content: string;
  label?: string;
  comment?: string;
  createdAt: string;
}

interface VersionHistoryProps {
  noteId: string;
  onRestore: (versionId: string) => void;
  className?: string;
}

export default function VersionHistory({
  noteId,
  onRestore,
  className = '',
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [noteId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes/${noteId}/versions`);
      const data = await response.json();

      if (data.success) {
        setVersions(data.versions);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite the current content.')) {
      return;
    }

    setRestoring(true);
    try {
      await onRestore(versionId);
      setSelectedVersion(null);
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading versions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-red-600 dark:text-red-400 ${className}`}>
        {error}
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        No version history available
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Version List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
            Version History
          </h3>
          {versions.map((version) => (
            <div
              key={version._id}
              onClick={() => setSelectedVersion(version)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedVersion?._id === version._id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Version {version.version}
                    </span>
                    {version.label && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {version.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {format(new Date(version.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                  {version.comment && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                      "{version.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Version Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          {selectedVersion ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Preview
                </h3>
                <button
                  onClick={() => handleRestore(selectedVersion._id)}
                  disabled={restoring}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                >
                  {restoring ? 'Restoring...' : 'Restore This Version'}
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedVersion.title}
                </h4>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Select a version to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
