/**
 * Payment Success Page
 * Displays success message after successful Stripe checkout
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Welcome to ThinkMate Pro! Your subscription is now active.
        </p>

        {/* Features */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            You now have access to:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>✓ Unlimited notes</li>
            <li>✓ Advanced AI features</li>
            <li>✓ Priority support</li>
            <li>✓ Team collaboration</li>
            <li>✓ Custom templates</li>
            <li>✓ Export options</li>
          </ul>
        </div>

        {/* Redirect Info */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Redirecting to dashboard in {countdown} seconds...
        </p>

        {/* Manual Redirect Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
