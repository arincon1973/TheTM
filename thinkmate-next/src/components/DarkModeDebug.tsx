'use client';

import { useState, useEffect } from 'react';

/**
 * DarkModeDebug Component
 * Temporary component to debug dark mode functionality
 * Shows current state and allows manual testing
 * 
 * TO USE: Add <DarkModeDebug /> to your page temporarily
 */
export default function DarkModeDebug() {
  const [darkMode, setDarkMode] = useState<string | null>(null);
  const [hasDarkClass, setHasDarkClass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage
    const stored = localStorage.getItem('darkMode');
    setDarkMode(stored);
    
    // Check if dark class exists
    const hasClass = document.documentElement.classList.contains('dark');
    setHasDarkClass(hasClass);
    
    // Update every second to track changes
    const interval = setInterval(() => {
      const hasClass = document.documentElement.classList.contains('dark');
      setHasDarkClass(hasClass);
      const stored = localStorage.getItem('darkMode');
      setDarkMode(stored);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 p-4 rounded-lg shadow-lg text-xs max-w-xs z-[9999]">
      <div className="font-bold mb-2 text-gray-900 dark:text-gray-100">Dark Mode Debug</div>
      
      <div className="space-y-1 text-gray-800 dark:text-gray-200">
        <div>
          <strong>localStorage:</strong> {darkMode || 'null'}
        </div>
        <div>
          <strong>Has 'dark' class:</strong> {hasDarkClass ? 'Yes ✅' : 'No ❌'}
        </div>
        <div>
          <strong>This box bg:</strong> 
          <span className="ml-1 dark:hidden">Light</span>
          <span className="ml-1 hidden dark:inline">Dark</span>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <button
          onClick={() => {
            localStorage.setItem('darkMode', 'enabled');
            document.documentElement.classList.add('dark');
          }}
          className="w-full px-2 py-1 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
        >
          Force Enable Dark
        </button>
        <button
          onClick={() => {
            localStorage.setItem('darkMode', 'disabled');
            document.documentElement.classList.remove('dark');
          }}
          className="w-full px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300"
        >
          Force Disable Dark
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            document.documentElement.classList.remove('dark');
            window.location.reload();
          }}
          className="w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Clear & Reload
        </button>
      </div>
    </div>
  );
}
