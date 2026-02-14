'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import DarkModeToggle from '@/components/DarkModeToggle';

/**
 * Navbar Component
 * Navigation bar with links and mobile-responsive hamburger menu
 * Features green hover effects and clean typography
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
              ThinkMate
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </a>
            
            {/* Dashboard link - only show when authenticated */}
            {isAuthenticated && (
              <a 
                href="/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </a>
            )}
            
            <a 
              href="/#features" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Features
            </a>
            <a 
              href="/#pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Pricing
            </a>
            <a 
              href="/#contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
            </a>
            
            {/* Sign In/Sign Out button - changes based on auth status */}
            {isAuthenticated ? (
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Sign Out
              </button>
            ) : (
              <a 
                href="/auth/sign-in" 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                onClick={closeMobileMenu}
              >
                Sign In
              </a>
            )}
            
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={closeMobileMenu}
          >
            Home
          </a>
          
          {/* Dashboard link - only show when authenticated */}
          {isAuthenticated && (
            <a
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={closeMobileMenu}
            >
              Dashboard
            </a>
          )}
          
          <a
            href="/#features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a
            href="/#pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={closeMobileMenu}
          >
            Pricing
          </a>
          <a
            href="/#contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={closeMobileMenu}
          >
            Contact
          </a>
          
          {/* Dark Mode Toggle in Mobile Menu */}
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-base font-medium text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
            <DarkModeToggle />
          </div>
          
          {/* Sign In/Sign Out button - changes based on auth status */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                closeMobileMenu();
                signOut({ callbackUrl: '/' });
              }}
              className="w-full block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 text-white transition-colors text-center"
            >
              Sign Out
            </button>
          ) : (
            <a
              href="/auth/sign-in"
              className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 text-white transition-colors text-center"
              onClick={closeMobileMenu}
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
