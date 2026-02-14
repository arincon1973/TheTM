'use client'; // React Server Component directive - marks this as a client component for interactivity

// React hooks - useState manages component state, useEffect runs side effects
import { useState, useEffect } from 'react';

/**
 * Navbar Component - Responsive navigation header
 * Demonstrates: React hooks, event handling, conditional rendering, Tailwind CSS
 */
export default function Navbar() {
  // useState Hook - Manages component state (replaces vanilla JS variables)
  // CSS: display: none/flex → Tailwind: hidden/flex (toggled via state)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // useEffect Hook - Runs after component mounts (replaces vanilla JS on load)
  // Similar to: window.addEventListener('load', function() { ... })
  useEffect(() => {
    // Check localStorage for dark mode preference (same as vanilla JS)
    const savedDarkMode = localStorage.getItem('darkMode') === 'enabled';
    setDarkMode(savedDarkMode);
    
    // Apply dark mode class to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []); // Empty dependency array = run once on mount

  // Function to toggle dark mode (replaces vanilla JS function)
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Toggle dark class on document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // JSX Return - React's HTML-like syntax
  return (
    // <header> - Semantic HTML tag
    // CSS: position: sticky, top: 0, z-index: 1000, background-color, border-bottom
    // → Tailwind: sticky top-0 z-[1000] bg-white dark:bg-gray-900 border-b border-gray-200
    <header className="sticky top-0 z-[1000] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      {/* <nav> - Navigation container */}
      {/* CSS: display: flex, justify-content: space-between, align-items: center, padding, max-width, margin: 0 auto
          → Tailwind: flex justify-between items-center px-6 py-4 max-w-7xl mx-auto */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo section */}
        {/* CSS: font-size: 1.5rem, font-weight: 700, color: var(--primary)
            → Tailwind: text-2xl font-bold text-blue-500 cursor-pointer */}
        <div className="text-2xl font-bold text-blue-500 cursor-pointer">
          <h1>ThinkMate</h1>
        </div>

        {/* Mobile menu toggle button */}
        {/* CSS: display: flex (on mobile), flex-direction: column, gap: 4px, @media (max-width: 768px)
            → Tailwind: md:hidden (hidden on desktop, shown on mobile - mobile-first) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle navigation menu"
        >
          {/* Hamburger icon bars */}
          {/* CSS: width: 25px, height: 3px, background-color, border-radius, transition
              → Tailwind: w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-transform */}
          <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Desktop and Mobile Navigation Links */}
        {/* Conditional rendering with template literal: ${condition ? 'class' : 'class'}
            CSS: display: flex on desktop, hidden on mobile, position: absolute on mobile
            → Tailwind: hidden md:flex (responsive breakpoint) */}
        <ul className={`
          ${mobileMenuOpen ? 'flex' : 'hidden'} 
          md:flex 
          flex-col md:flex-row 
          absolute md:relative 
          top-full md:top-0 
          left-0 md:left-auto 
          w-full md:w-auto 
          bg-white dark:bg-gray-900 
          md:bg-transparent 
          border-t md:border-t-0 
          border-gray-200 dark:border-gray-700
          shadow-md md:shadow-none
          items-center 
          gap-6 
          p-6 md:p-0
          transition-all duration-300
        `}>
          {/* Navigation links - <li> and <a> tags */}
          {/* CSS: text-decoration: none, color, font-weight: 500, transition: color
              → Tailwind: no-underline text-gray-800 dark:text-gray-200 font-medium hover:text-blue-500 transition-colors */}
          <li>
            <a href="#features" className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-500 transition-colors">
              Features
            </a>
          </li>
          <li>
            <a href="#contact" className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-500 transition-colors">
              Contact
            </a>
          </li>
          <li>
            {/* Dark mode toggle button */}
            {/* CSS: background: none, border: 2px solid, border-radius, padding, transition
                → Tailwind: border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:scale-110 transition-transform */}
            <button
              onClick={toggleDarkMode}
              className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xl hover:scale-110 hover:border-blue-500 transition-all"
              aria-label="Toggle dark mode"
            >
              {/* Conditional rendering in JSX - replaces if/else for changing icon */}
              <span>{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

/**
 * REACT CONCEPTS DEMONSTRATED:
 * 
 * 1. 'use client' directive - Marks component for client-side rendering
 * 2. useState Hook - Manages component state
 * 3. useEffect Hook - Side effects (runs after render)
 * 4. Event Handlers - onClick events
 * 5. Conditional Rendering - {condition ? valueA : valueB}
 * 6. Template Literals - `string ${variable}`
 * 7. Arrow Functions - () => {}
 * 8. Logical NOT Operator - !variable
 * 9. localStorage API - Same as vanilla JS
 * 10. className prop - React's version of class attribute
 * 11. JSX Syntax - HTML-like syntax in JavaScript
 * 12. Component Props - Reusable component inputs (not used here but available)
 * 13. Functional Components - Modern React component syntax
 * 14. State Management - useState replaces vanilla JS variables
 * 15. Lifecycle Methods - useEffect replaces componentDidMount
 */
