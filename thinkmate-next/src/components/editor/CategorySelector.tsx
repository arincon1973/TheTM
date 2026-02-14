'use client';

/**
 * Category Selector Component
 * Dropdown for selecting note categories
 */

import { useState, useEffect } from 'react';

export interface Category {
  _id: string;
  name: string;
  color: string;
  icon?: string;
  parentId?: string;
}

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
  categories: Category[];
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
}

export default function CategorySelector({
  value,
  onChange,
  categories,
  placeholder = 'Select a category',
  className = '',
  allowClear = true,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find((c) => c._id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2 flex-1 text-left">
          {selectedCategory ? (
            <>
              {selectedCategory.icon && (
                <span className="text-lg">{selectedCategory.icon}</span>
              )}
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
              <span className="text-gray-900 dark:text-gray-100">
                {selectedCategory.name}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {placeholder}
            </span>
          )}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {allowClear && value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-500 dark:text-gray-400 italic">
                Clear selection
              </span>
            </button>
          )}
          
          {categories.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No categories available
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => {
                  onChange(category._id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  value === category._id
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : ''
                }`}
              >
                {category.icon && (
                  <span className="text-lg">{category.icon}</span>
                )}
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1 text-left text-gray-900 dark:text-gray-100">
                  {category.name}
                </span>
                {value === category._id && (
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
