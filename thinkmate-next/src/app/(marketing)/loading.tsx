/**
 * Loading UI for Marketing Pages
 * Shows while the home/landing page is loading
 * Displays a green-themed spinner with ThinkMate branding
 */

export default function MarketingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="text-center">
        {/* ThinkMate Logo/Brand */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          ThinkMate
        </h1>
        
        {/* Spinner */}
        <div className="inline-block relative mb-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading your workspace...
        </p>
        
        {/* Optional animated dots */}
        <div className="mt-2 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
