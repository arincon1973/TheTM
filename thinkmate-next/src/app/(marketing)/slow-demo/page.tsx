/**
 * Slow Demo Page
 * This page artificially delays loading to demonstrate the loading.tsx UI
 * Navigate to this page to see the green loading spinner in action
 */

import Hero from '@/components/ui/Hero';
import FeatureCard from '@/components/ui/FeatureCard';

// Simulate slow data fetching
async function getPageData() {
  // Artificial 3-second delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    title: "Loading Demo",
    description: "You should have just seen the loading spinner for 3 seconds!"
  };
}

export default async function SlowDemoPage() {
  const data = await getPageData();
  
  return (
    <main>
      <Hero
        headline={data.title}
        subheadline="Loading State Demonstration"
        description={data.description}
        ctaText="Back to Home"
        ctaHref="/"
        backgroundImage="/images/hero-bg.jpg"
      />

      <section className="px-6 py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            ✅ Loading State Works!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The green ThinkMate loading spinner appeared for 3 seconds while this page was loading.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <FeatureCard
              icon="⏳"
              title="Loading Component"
              description="Located at src/app/(marketing)/loading.tsx"
            />
            <FeatureCard
              icon="🎨"
              title="Green Theme"
              description="Custom spinner with ThinkMate branding and dark mode support"
            />
            <FeatureCard
              icon="⚡"
              title="Auto-Triggered"
              description="Shows automatically during navigation and page rendering"
            />
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-400">
              How to See Loading States:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
              <li>• <strong>Refresh this page</strong> - You'll see the loading spinner for 3 seconds</li>
              <li>• <strong>Navigate from home</strong> - Click a link to this page to see loading during navigation</li>
              <li>• <strong>Use Chrome DevTools</strong> - Enable "Slow 3G" throttling to see loading on all pages</li>
              <li>• <strong>Production builds</strong> - Loading states are more visible in production due to code splitting</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
