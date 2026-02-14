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
    <Card hover padding="lg" className={`text-center ${className}`}>
      {/* Icon */}
      <div className="text-5xl mb-4 flex items-center justify-center">
        {typeof icon === 'string' ? (
          <span role="img" aria-label={title}>
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
