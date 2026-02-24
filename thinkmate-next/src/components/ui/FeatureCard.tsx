import React from 'react';
import Card from './Card';

/**
 * FeatureCard Component
 * Displays a feature with icon, title, and description
 * Uses the generic Card component for consistent styling
 */

interface FeatureCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className = ''
}: FeatureCardProps) {
  return (
    <Card hover padding="lg" className={`text-center group ${className}`}>
      {/* Icon with glow effect in dark mode */}
      <div className="text-5xl mb-4 flex items-center justify-center">
        {typeof icon === 'string' ? (
          <span role="img" aria-label={title} className="transition-transform">
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>
      
      {/* Title with glow effect in dark mode */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white group-hover:dark:text-green-400 transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed group-hover:dark:text-white transition-colors">
        {description}
      </p>
    </Card>
  );
}
