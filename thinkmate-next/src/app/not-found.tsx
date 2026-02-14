import Link from 'next/link';
import Button from '@/components/ui/Button';

/**
 * Not Found Page (404)
 * Custom 404 page for missing routes
 * Styled with Tailwind CSS and green theme
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          404
        </h1>
        
        {/* Error Message */}
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        {/* Back to Home Button */}
        <Link href="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
