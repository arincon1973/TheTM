/**
 * Marketing Landing Page
 * Main landing page for ThinkMate
 * Uses modular components: Hero, FeatureCard, Pricing, Contact
 * 
 * Route Group: (marketing)
 * This page is part of the marketing route group for better organization
 */

import Hero from '@/components/ui/Hero';
import FeatureCard from '@/components/ui/FeatureCard';
import Pricing from '@/components/ui/Pricing';
import Contact from '@/components/ui/Contact';

export default function Home() {
  return (
    <main>
      {/* Hero Section - Main landing banner */}
      <Hero
        headline="Welcome to ThinkMate"
        subheadline="Your AI-powered writing companion"
        description="Transform your ideas into brilliant content with intelligent note-taking and AI-assisted writing tools."
        ctaText="Get Started"
        ctaHref="#contact"
        backgroundImage="/images/hero-bg.jpg"
      />

      {/* Features Section - Grid of features using FeatureCard components */}
      <section id="features" className="px-6 py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Why Choose ThinkMate?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed to enhance your writing experience
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="✏️"
              title="Smart Note-Taking"
              description="Organize your thoughts effortlessly with intelligent categorization and quick search capabilities."
            />
            <FeatureCard
              icon="🤖"
              title="AI Writing Assistant"
              description="Get real-time suggestions, grammar corrections, and style improvements powered by advanced AI."
            />
            <FeatureCard
              icon="☁️"
              title="Cloud Sync"
              description="Access your notes anywhere, anytime with seamless cloud synchronization across all devices."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section - Displays Free and Pro plans */}
      <Pricing />

      {/* Contact Section - Form for user inquiries */}
      <Contact />
    </main>
  );
}
