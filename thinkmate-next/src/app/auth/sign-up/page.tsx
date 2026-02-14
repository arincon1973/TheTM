/**
 * Sign Up Page
 * Public page for new user registration
 * Includes Google OAuth and Email/Password sign-up options
 */

import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up - ThinkMate',
  description: 'Create your ThinkMate account',
};

export default function SignUpPage() {
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
            Create your account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Start your journey with AI-powered writing
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <SignUpForm />
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
