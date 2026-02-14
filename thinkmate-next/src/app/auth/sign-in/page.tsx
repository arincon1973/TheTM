/**
 * Sign In Page
 * Public page for user authentication
 * Includes Google OAuth and Email/Password sign-in options
 */

import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In - ThinkMate',
  description: 'Sign in to your ThinkMate account',
};

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ThinkMate
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <SignInForm />
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
