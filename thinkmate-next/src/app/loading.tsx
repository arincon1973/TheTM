/**
 * Loading Component
 * Loading UI displayed during page transitions
 * Shows spinner and skeleton loader
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </div>
  );
}
