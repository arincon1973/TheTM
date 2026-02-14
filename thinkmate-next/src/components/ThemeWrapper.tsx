'use client';

/**
 * Theme Wrapper Component
 * Ensures dark mode is applied correctly on client-side
 * Prevents flash of unstyled content (FOUC)
 */

import { useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply dark mode immediately on mount
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      document.documentElement.classList.add('dark');
    } else if (darkMode === 'disabled') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}
