'use client';

// Import React hooks
import { useEffect, useRef, useState } from 'react';

/**
 * Features Component - Grid of feature cards with scroll animation
 * Demonstrates: CSS Grid in Tailwind, Intersection Observer, useState, useRef
 */
export default function Features() {
  // useRef Hook - Creates a reference to DOM element (replaces document.querySelector)
  // Similar to: const featuresSection = document.querySelector('#features')
  const featuresRef = useRef<HTMLElement>(null);
  
  // useState - Tracks visibility for animation
  const [isVisible, setIsVisible] = useState(false);

  // useEffect - Set up Intersection Observer for scroll animation
  // Replaces vanilla JS: new IntersectionObserver(callback, options)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Start observing the element
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    // Cleanup function - runs when component unmounts
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []); // Empty array = run once on mount

  // Array of features data (data-driven approach)
  const features = [
    {
      icon: '✏️',
      title: 'Smart Note-Taking',
      description: 'Organize your thoughts effortlessly with intelligent categorization and quick search capabilities.'
    },
    {
      icon: '🤖',
      title: 'AI Writing Assistant',
      description: 'Get real-time suggestions, grammar corrections, and style improvements powered by advanced AI.'
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Access your notes anywhere, anytime with seamless cloud synchronization across all devices.'
    }
  ];

  return (
    // <section> with ref for Intersection Observer
    // CSS: padding: 4rem 1.5rem, background-color: var(--surface), opacity: 0 → 1 (animation)
    // → Tailwind: px-6 py-16 md:py-24 bg-gray-50 dark:bg-gray-800 transition-opacity duration-600
    <section
      id="features"
      ref={featuresRef}
      className={`px-6 py-16 md:py-24 bg-gray-50 dark:bg-gray-800 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {/* Container div */}
      {/* CSS: max-width: 1200px, margin: 0 auto
          → Tailwind: max-w-7xl mx-auto */}
      <div className="max-w-7xl mx-auto">
        {/* Section title - <h2> */}
        {/* CSS: font-size: 2.5rem (40px), font-weight: 700, text-align: center, margin-bottom: 1rem
            → Tailwind: text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100 */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Why Choose ThinkMate?
        </h2>
        
        {/* Section description - <p> */}
        {/* CSS: font-size: 1.125rem, text-align: center, color: var(--text-light), margin-bottom: 3rem
            → Tailwind: text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 mb-12 */}
        <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
          Powerful features designed to enhance your writing experience
        </p>

        {/* Features grid - CSS Grid layout */}
        {/* CSS: display: grid, grid-template-columns: repeat(3, 1fr), gap: 2rem
            → Tailwind: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
            Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map over features array - React pattern for rendering lists */}
          {features.map((feature, index) => (
            // <article> - Semantic HTML for independent content
            // CSS: background-color, padding: 2rem, border-radius: 8px, text-align: center,
            //      box-shadow, border, transition, hover:transform: translateY(-5px)
            // → Tailwind: bg-white dark:bg-gray-900 p-8 rounded-lg text-center shadow-sm 
            //             border border-gray-200 dark:border-gray-700 transition-all duration-300
            //             hover:-translate-y-2 hover:shadow-lg
            <article
              key={index} // React key prop for list items (required)
              className="bg-white dark:bg-gray-900 p-8 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              {/* Feature icon container */}
              {/* CSS: font-size: 3rem (48px), margin-bottom: 1rem
                  → Tailwind: text-5xl mb-4 */}
              <div className="text-5xl mb-4">
                <span>{feature.icon}</span>
              </div>
              
              {/* Feature title - <h3> */}
              {/* CSS: font-size: 1.5rem (24px), font-weight: 600, margin-bottom: 1rem
                  → Tailwind: text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 */}
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              
              {/* Feature description - <p> */}
              {/* CSS: font-size: 1rem, color: var(--text-light), line-height: 1.6
                  → Tailwind: text-base text-gray-600 dark:text-gray-400 leading-relaxed */}
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * REACT CONCEPTS DEMONSTRATED:
 * 
 * 1. useRef Hook - Reference to DOM elements
 * 2. useState Hook - Track visibility state
 * 3. useEffect Hook - Set up side effects (Intersection Observer)
 * 4. Cleanup Functions - Return function in useEffect
 * 5. Array.map() - Render list of components
 * 6. Key Prop - Unique identifier for list items
 * 7. Data-Driven Rendering - Separate data from presentation
 * 8. Conditional Classes - Template literals with conditions
 * 9. TypeScript Generics - useRef<HTMLElement>
 * 10. Component Composition - Building complex UI from simple parts
 * 
 * ADDITIONAL TAILWIND MAPPINGS:
 * 
 * 11. display: grid → grid
 * 12. grid-template-columns: repeat(3, 1fr) → grid-cols-3 (+ responsive variants)
 * 13. gap: 2rem → gap-8 (Tailwind spacing scale: 1 unit = 0.25rem)
 * 14. line-height: 1.6 → leading-relaxed
 * 15. hover: all effects → hover: prefix on each class
 */
