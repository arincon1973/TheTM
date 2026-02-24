import React from 'react';

/**
 * Card Component
 * Generic reusable card for UI elements
 * Supports different padding sizes and hover effects
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick
}: CardProps) {
  // Base styles
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-green-600 transition-all duration-300';
  
  // Padding styles
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  // Hover effect
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1 dark:hover:border-green-400 dark:hover:shadow-green-900 cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
