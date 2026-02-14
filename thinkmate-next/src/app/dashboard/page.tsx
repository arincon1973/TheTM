'use client';

/**
 * Dashboard Page (Protected)
 * Only accessible to authenticated users
 * Displays user's workspace and AI note-taking features
 * Dark mode fully supported with conditional styling
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NoteForm from '@/components/ui/NoteForm';
import NotesList from '@/components/ui/NotesList';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Check dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'enabled';
    setDarkMode(savedDarkMode);
    
    // Apply dark class
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in');
    }
  }, [status, router]);

  // Show loading state
  if (!mounted || status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#000000' : '#f9fafb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid',
            borderColor: darkMode ? '#374151' : '#e5e7eb',
            borderTopColor: '#16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}></div>
          <p style={{ color: darkMode ? '#d1d5db' : '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Inline styles for guaranteed dark mode support
  const styles = {
    main: {
      minHeight: '100vh',
      backgroundColor: darkMode ? '#000000' : '#f9fafb',
      color: darkMode ? '#ffffff' : '#111827',
    },
    header: {
      backgroundColor: darkMode ? '#0a0a0a' : '#ffffff',
      borderBottom: `1px solid ${darkMode ? '#27272a' : '#e5e7eb'}`,
      padding: '1rem 1.5rem',
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: darkMode ? '#ffffff' : '#111827',
      marginBottom: '0.25rem',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
    },
    content: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '3rem 1.5rem',
    },
    card: {
      backgroundColor: darkMode ? '#18181b' : '#ffffff',
      border: darkMode ? '1px solid #27272a' : 'none',
      borderRadius: '0.5rem',
      boxShadow: darkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: darkMode ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)' : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: darkMode ? '#ffffff' : '#111827',
      marginBottom: '0.5rem',
    },
    cardText: {
      fontSize: '0.875rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
    },
    iconCircle: (bgColor: string) => ({
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgColor,
      marginBottom: '1rem',
    }),
  };

  return (
    <main style={styles.main}>
      {/* Dashboard Header */}
      <header style={styles.header}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={styles.headerTitle}>
            ThinkMate Dashboard
          </h1>
          <p style={styles.headerSubtitle}>
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>
      </header>

      {/* Dashboard Content */}
      <div style={styles.content}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Profile Card - Scrolls to top */}
          <div 
            style={styles.card}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div style={styles.iconCircle(darkMode ? '#14532d' : '#dcfce7')}>
              <svg
                style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Your Profile</h3>
            <p style={styles.cardText}>{session.user.email}</p>
            <p style={{ ...styles.cardText, fontSize: '0.75rem', marginTop: '0.5rem' }}>
              Signed in with: {session.user.provider || 'Email'}
            </p>
          </div>

          {/* Notes Card - Scrolls to saved notes section */}
          <div 
            style={styles.card}
            onClick={() => scrollToSection('saved-notes')}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                scrollToSection('saved-notes');
              }
            }}
          >
            <div style={styles.iconCircle(darkMode ? '#1e3a8a' : '#dbeafe')}>
              <svg
                style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>My Notes</h3>
            <p style={styles.cardText}>
              View your saved notes and documents
            </p>
          </div>

          {/* AI Assistant Card - Scrolls to AI generator */}
          <div 
            style={styles.card}
            onClick={() => scrollToSection('ai-generator')}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                scrollToSection('ai-generator');
              }
            }}
          >
            <div style={styles.iconCircle(darkMode ? '#581c87' : '#f3e8ff')}>
              <svg
                style={{ width: '1.5rem', height: '1.5rem', color: '#a855f7' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>AI Assistant</h3>
            <p style={styles.cardText}>
              Generate notes with AI assistance
            </p>
          </div>
        </div>

        {/* AI Note-Taking Feature */}
        <div id="ai-generator" style={{ marginTop: '3rem', scrollMarginTop: '6rem' }}>
          <NoteForm />
        </div>

        {/* Saved Notes List */}
        <div id="saved-notes" style={{ marginTop: '3rem', scrollMarginTop: '6rem' }}>
          <NotesList />
        </div>

        {/* Advanced Features Section */}
        <div style={{
          marginTop: '3rem',
          background: 'linear-gradient(to right, #16a34a, #3b82f6)',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          color: '#ffffff',
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' }}>
            🎉 New Advanced Features Available!
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            Your notes now have powerful capabilities:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ opacity: 0.9 }}>
              <strong>✨ Rich Text Editor</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Full formatting, tables, code blocks</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>🏷️ Tags & Categories</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Organize with tags and folders</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>📎 File Attachments</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Upload images, PDFs, and more</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>📋 Templates</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Quick start with pre-built templates</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>⏱️ Version History</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Track changes and restore versions</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>🔗 Note Sharing</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Share with permissions and links</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>📄 Export Options</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>PDF, Markdown, HTML & more</p>
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>🔍 Advanced Search</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Filter by tags, dates, categories</p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '1.5rem' }}>
            Click on any note to access all features including rich text editing, attachments, version history, and sharing!
          </p>
        </div>
      </div>
    </main>
  );
}
