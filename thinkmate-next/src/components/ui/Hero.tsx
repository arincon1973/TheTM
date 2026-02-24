'use client';

import React, { useState, useEffect } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  // Monitor dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

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
      className="relative min-h-[600px] flex items-center justify-center text-white px-6 py-16 md:py-24"
      style={{
        background: isDark 
          ? '#000000'
          : 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(139, 92, 246))',
        borderBottom: isDark ? '4px solid rgb(22, 163, 74)' : 'none',
      }}
    >
      {/* Background image overlay - only in light mode */}
      {!isDark && (
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      )}

      {/* Content */}
      <div className="max-w-4xl z-10 relative text-center">
        {/* Headline */}
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          style={{
            color: isDark ? '#22c55e' : '#ffffff',
            textShadow: isDark ? '0 0 40px rgba(34, 197, 94, 0.8)' : '0 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p 
          className="text-xl md:text-2xl font-normal mb-4"
          style={{
            color: isDark ? '#86efac' : '#ffffff',
            opacity: 0.95,
            textShadow: isDark ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none',
          }}
        >
          {subheadline}
        </p>

        {/* Description */}
        <p 
          className="text-lg md:text-xl mb-12 max-w-2xl mx-auto"
          style={{
            color: isDark ? '#e5e7eb' : '#ffffff',
            opacity: 0.9,
          }}
        >
          {description}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 text-lg font-semibold rounded-lg shadow-xl transition-all duration-300"
          style={{
            backgroundColor: isDark ? '#16a34a' : '#ffffff',
            color: isDark ? '#ffffff' : '#16a34a',
            boxShadow: isDark ? '0 0 50px rgba(34, 197, 94, 0.8)' : '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: isDark ? '2px solid #22c55e' : 'none',
          }}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}
