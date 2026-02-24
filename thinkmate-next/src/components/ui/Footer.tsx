'use client';

import React from 'react';

/**
 * Footer Component
 * Site footer with navigation links, branding, and social media
 * Responsive layout with proper spacing and hover effects
 */

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  links?: FooterLink[];
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  copyrightYear?: number;
}

export default function Footer({
  brandName = 'ThinkMate',
  links = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' }
  ],
  socialLinks = {
    github: 'https://github.com/arincon1973/TheTM'
  },
  copyrightYear = new Date().getFullYear()
}: FooterProps) {
  return (
    <footer className="bg-gray-50 dark:bg-black px-6 py-12 border-t-4 border-gray-200 dark:border-green-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">
              {brandName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your AI-powered writing companion for note-taking and content creation.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {copyrightYear} {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
