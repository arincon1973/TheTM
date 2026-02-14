'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import Card from './Card';
import Button from './Button';

/**
 * Contact Component
 * Contact form with validation and success message
 * Includes name, email, and message fields
 */

interface ContactProps {
  title?: string;
  subtitle?: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

export default function Contact({
  title = 'Get in Touch',
  subtitle = "Have questions? We'd love to hear from you."
}: ContactProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      email: '',
      message: ''
    };

    let isValid = true;

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name (at least 2 characters)';
      isValid = false;
    }

    if (formData.email.trim() === '') {
      newErrors.email = 'Please enter your email address';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Please enter a message (at least 10 characters)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      console.log('Form submitted successfully!');
    }
  };

  return (
    <section id="contact" className="px-6 py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
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

        {/* Contact Form */}
        <Card padding="lg" className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-800 dark:text-gray-200"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
              />
              {errors.name && (
                <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-800 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
              />
              {errors.email && (
                <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block mb-2 font-medium text-gray-800 dark:text-gray-200"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Your message"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all resize-y min-h-[120px]"
              />
              {errors.message && (
                <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-6 bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg text-center animate-fade-in">
                Thank you! Your message has been sent.
              </div>
            )}
          </form>
        </Card>
      </div>
    </section>
  );
}
