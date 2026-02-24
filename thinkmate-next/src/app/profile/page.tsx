/**
 * User Profile Page
 * Displays user information and account settings
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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

  /**
   * Handle password change
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordSuccess('✅ Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Clear success message after 5 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

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
      maxWidth: '56rem',
      margin: '0 auto',
      padding: '3rem 1.5rem',
    },
    card: {
      backgroundColor: darkMode ? '#18181b' : '#ffffff',
      border: darkMode ? '1px solid #27272a' : 'none',
      borderRadius: '0.5rem',
      boxShadow: darkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: darkMode ? '#ffffff' : '#111827',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: `2px solid ${darkMode ? '#16a34a' : '#e5e7eb'}`,
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '0.5rem',
      display: 'block',
    },
    value: {
      fontSize: '1rem',
      color: darkMode ? '#ffffff' : '#111827',
      marginBottom: '1.5rem',
    },
    badge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      backgroundColor: darkMode ? '#14532d' : '#dcfce7',
      color: '#16a34a',
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: darkMode ? '#374151' : '#f3f4f6',
      color: darkMode ? '#ffffff' : '#111827',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginRight: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: darkMode ? '#18181b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#111827',
      border: `2px solid ${darkMode ? '#27272a' : '#e5e7eb'}`,
      borderRadius: '0.5rem',
      fontSize: '1rem',
      transition: 'all 0.2s',
      outline: 'none',
    },
  };

  // Check if user uses email/password (credentials) or Google OAuth
  const isEmailPasswordUser = session.user.provider === 'credentials' || session.user.provider === 'email' || !session.user.provider;

  return (
    <main style={styles.main}>
      {/* Profile Header */}
      <header style={styles.header}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h1 style={styles.headerTitle}>Your Profile</h1>
          <p style={styles.headerSubtitle}>Manage your account settings and preferences</p>
        </div>
      </header>

      {/* Profile Content */}
      <div style={styles.content}>
        {/* Account Information Card */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Account Information</h2>
          
          <div>
            <label style={styles.label}>Full Name</label>
            <p style={styles.value}>{session.user.name || 'Not provided'}</p>
          </div>

          <div>
            <label style={styles.label}>Email Address</label>
            <p style={styles.value}>{session.user.email}</p>
          </div>

          <div>
            <label style={styles.label}>Sign-In Method</label>
            <div style={styles.value}>
              <span style={styles.badge}>
                {session.user.provider === 'google' ? '🔐 Google OAuth' : '📧 Email & Password'}
              </span>
              {isEmailPasswordUser && (
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginTop: '0.5rem' 
                }}>
                  You can change your password in the section below
                </p>
              )}
            </div>
          </div>

          {session.user.image && (
            <div>
              <label style={styles.label}>Profile Picture</label>
              <img 
                src={session.user.image} 
                alt="Profile" 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${darkMode ? '#16a34a' : '#10b981'}`,
                }}
              />
            </div>
          )}
        </div>

        {/* Account Status Card */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Account Status</h2>
          
          <div>
            <label style={styles.label}>Account Type</label>
            <p style={styles.value}>
              <span style={styles.badge}>Free Plan</span>
            </p>
          </div>

          <div>
            <label style={styles.label}>AI Generations</label>
            <p style={styles.value}>5 generations available</p>
          </div>
        </div>

        {/* Change Password Card - Only for email/password users */}
        {isEmailPasswordUser && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Change Password</h2>
            
            <form onSubmit={handlePasswordChange}>
              {/* Current Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={styles.input}
                  disabled={changingPassword}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#16a34a';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? '#27272a' : '#e5e7eb';
                  }}
                />
              </div>

              {/* New Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  style={styles.input}
                  disabled={changingPassword}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#16a34a';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? '#27272a' : '#e5e7eb';
                  }}
                />
              </div>

              {/* Confirm New Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={styles.input}
                  disabled={changingPassword}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#16a34a';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? '#27272a' : '#e5e7eb';
                  }}
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
                  color: darkMode ? '#fca5a5' : '#dc2626',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}>
                  {passwordError}
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: darkMode ? '#14532d' : '#dcfce7',
                  color: darkMode ? '#86efac' : '#16a34a',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}>
                  {passwordSuccess}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={changingPassword}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: changingPassword ? (darkMode ? '#374151' : '#d1d5db') : '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: changingPassword ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: changingPassword ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!changingPassword) {
                    e.currentTarget.style.backgroundColor = '#15803d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!changingPassword) {
                    e.currentTarget.style.backgroundColor = '#16a34a';
                  }
                }}
              >
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* Actions */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Actions</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                ...styles.button,
                backgroundColor: '#16a34a',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
