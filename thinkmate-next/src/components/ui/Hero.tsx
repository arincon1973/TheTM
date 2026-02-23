'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from './Button';

/**
 * Hero Component
 * Main landing section with background image, headline, subheadline, and CTA
 * Features gradient overlay and responsive typography
 * CTA redirects to dashboard if authenticated, otherwise to sign-in
 */

interface HeroProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export default function Hero({
  headline = 'Welcome to ThinkMate',
  subheadline = 'Your AI-powered writing companion',
  description = 'Transform your ideas into brilliant content with intelligent note-taking and AI-assisted writing tools.',
  ctaText = 'Get Started',
  ctaHref = '#contact',
  backgroundImage = '/images/hero-bg.jpg'
}: HeroProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/sign-in');
    }
  };

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 min-h-[600px] flex items-center justify-center text-white px-6 py-16 md:py-24"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(59, 130, 246, 0.85), rgba(139, 92, 246, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* Content */}
      <div className="max-w-4xl z-10 relative text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl font-normal mb-4 opacity-95">
          {subheadline}
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto">
          {description}
        </p>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          className="!bg-white !text-green-600 dark:!bg-gray-800 dark:!text-green-400 hover:!bg-gray-50 dark:hover:!bg-gray-700 shadow-xl"
          onClick={handleGetStarted}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
}
