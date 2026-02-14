'use client';

/**
 * Template Library Component
 * Browse and use templates
 */

import { useState, useEffect } from 'react';

interface Template {
  _id: string;
  name: string;
  description?: string;
  category: string;
  isPublic: boolean;
  usageCount: number;
}

interface TemplateLibraryProps {
  onSelectTemplate: (templateId: string) => void;
  className?: string;
}

export default function TemplateLibrary({
  onSelectTemplate,
  className = '',
}: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading templates...</p>
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

  return (
    <div className={className}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No templates found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template._id}
              onClick={() => onSelectTemplate(template._id)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400">
                  {template.name}
                </h3>
                {template.isPublic && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    Public
                  </span>
                )}
              </div>
              {template.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {template.category}
                </span>
                <span>Used {template.usageCount} times</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
