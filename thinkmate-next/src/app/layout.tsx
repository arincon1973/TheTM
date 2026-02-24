/**
 * Root Layout for ThinkMate Landing Page
 * Enhanced with Navbar and Footer for consistent navigation across all pages
 * This is the top-level layout component in Next.js App Router
 */

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/Footer";
import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";

// Configure Inter font
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO and browser display
export const metadata: Metadata = {
  title: "ThinkMate",
  description: "Your AI-powered writing companion for note-taking and content creation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300`}>
        {/* Theme loader script - runs before page renders */}
        <Script
          id="theme-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'enabled') {
                    document.documentElement.classList.add('dark');
                  } else if (darkMode === 'disabled') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Failed to load theme:', e);
                }
              })();
            `,
          }}
        />
        
        {/* Session Provider for authentication */}
        <SessionProvider>
          {/* Navbar - Consistent across all pages */}
          <Navbar />
          
          {/* Main content - varies by page */}
          {children}
          
          {/* Footer - Consistent across all pages */}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
