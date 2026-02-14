'use client';

import React from 'react';
import Card from './Card';
import Button from './Button';

/**
 * Pricing Component
 * Displays pricing plans with features and CTAs
 * Supports Free and Pro tiers with feature lists
 */

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

interface PricingProps {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
}

export default function Pricing({
  title = 'Choose Your Plan',
  subtitle = 'Select the perfect plan for your needs',
  tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals getting started',
      features: [
        'Up to 50 notes',
        'Basic AI writing assistance',
        'Mobile app access',
        'Cloud sync',
        'Community support'
      ],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'For professionals who need more',
      features: [
        'Unlimited notes',
        'Advanced AI features',
        'Priority support',
        'Team collaboration',
        'Custom templates',
        'Export to multiple formats',
        'API access'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    }
  ]
}: PricingProps) {
  return (
    <section id="pricing" className="px-6 py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              padding="lg"
              className={`relative ${
                tier.highlighted
                  ? 'border-2 border-green-600 dark:border-green-500 shadow-xl'
                  : ''
              }`}
            >
              {/* Highlighted Badge */}
              {tier.highlighted && (
                <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    / {tier.period}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tier.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={tier.highlighted ? 'primary' : 'secondary'}
                fullWidth
                size="lg"
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
