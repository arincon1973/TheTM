'use client';

// Import React hooks
import { useState, FormEvent, ChangeEvent } from 'react';

/**
 * ContactForm Component - Contact form with validation
 * Demonstrates: Form handling in React, useState, event handlers, validation
 */
export default function ContactForm() {
  // useState - Form field values (controlled components pattern)
  // Replaces vanilla JS: document.querySelector('#name').value
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // useState - Error messages for each field
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // useState - Success message visibility
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Email validation function using RegEx
   * Same as vanilla JS version
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle input changes - updates form data state
   * Event handler in React (replaces vanilla JS addEventListener('input'))
   * TypeScript: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Destructuring event target properties
    
    // Update form data (setState with spread operator to preserve other fields)
    setFormData(prev => ({
      ...prev, // Spread operator - copies all existing properties
      [name]: value // Computed property name - updates specific field
    }));

    // Clear error for this field when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  /**
   * Validate entire form
   * Returns true if all fields are valid
   */
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };

    let isValid = true;

    // Validate name
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name (at least 2 characters)';
      isValid = false;
    }

    // Validate email
    if (formData.email.trim() === '') {
      newErrors.email = 'Please enter your email address';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate message
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Please enter a message (at least 10 characters)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle form submission
   * Event handler (replaces vanilla JS form.addEventListener('submit'))
   * TypeScript: FormEvent<HTMLFormElement>
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission (same as vanilla JS)

    if (validateForm()) {
      // Show success message
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      console.log('Form submitted successfully!');
      // In production: Send data to API endpoint
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    // <section> for contact form area
    // CSS: padding: 4rem 1.5rem, background-color: white
    // → Tailwind: px-6 py-16 md:py-24 bg-white dark:bg-gray-900
    <section id="contact" className="px-6 py-16 md:py-24 bg-white dark:bg-gray-900">
      {/* Container */}
      {/* CSS: max-width: 1200px, margin: 0 auto
          → Tailwind: max-w-7xl mx-auto */}
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        {/* CSS: font-size: 2.5rem, font-weight: 700, text-align: center, margin-bottom: 1rem
            → Tailwind: text-4xl md:text-5xl font-bold text-center mb-4 */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Get in Touch
        </h2>
        
        {/* Section description */}
        <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
          Have questions? We'd love to hear from you.
        </p>

        {/* Form element - onSubmit handler in React */}
        {/* CSS: max-width: 600px, margin: 0 auto, background-color, padding, border-radius, box-shadow
            → Tailwind: max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-md */}
        <form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-md"
        >
          {/* Form group - Name field */}
          {/* CSS: margin-bottom: 1.5rem, position: relative
              → Tailwind: mb-6 relative */}
          <div className="mb-6 relative">
            {/* Label - htmlFor in React (instead of 'for' in HTML) */}
            {/* CSS: display: block, margin-bottom: 0.5rem, font-weight: 500
                → Tailwind: block mb-2 font-medium text-gray-800 dark:text-gray-200 */}
            <label htmlFor="name" className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Name
            </label>
            
            {/* Input field - controlled component (value from state) */}
            {/* CSS: width: 100%, padding: 1rem, border: 2px solid, border-radius: 8px, transition
                → Tailwind: w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 
                            rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                            focus:outline-none focus:border-blue-500 transition-colors */}
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            />
            
            {/* Error message - conditional rendering */}
            {/* CSS: display: block, color: red, font-size: 0.875rem, margin-top: 0.5rem
                → Tailwind: block text-red-500 dark:text-red-400 text-sm mt-2 min-h-[20px] */}
            {errors.name && (
              <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email field - similar structure */}
          <div className="mb-6 relative">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            />
            {errors.email && (
              <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                {errors.email}
              </span>
            )}
          </div>

          {/* Message textarea field */}
          <div className="mb-6 relative">
            <label htmlFor="message" className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Message
            </label>
            {/* Textarea - similar to input but for multi-line text */}
            {/* CSS: resize: vertical, min-height: 120px
                → Tailwind: resize-y min-h-[120px] (custom height with arbitrary value) */}
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              placeholder="Your message"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all resize-y min-h-[120px]"
            />
            {errors.message && (
              <span className="block text-red-500 dark:text-red-400 text-sm mt-2">
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit button */}
          {/* CSS: width: 100%, padding, background-color, color, border: none, border-radius,
                  font-size, font-weight, cursor: pointer, transition, hover:background-color
              → Tailwind: w-full px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold
                          hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Send Message
          </button>

          {/* Success message - conditional rendering */}
          {/* CSS: display: none/block (toggled), background-color: green, color: white, padding, border-radius
              → Tailwind: bg-green-500 text-white px-4 py-3 rounded-lg text-center mt-6 (shown conditionally) */}
          {showSuccess && (
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg text-center mt-6 animate-fade-in">
              Thank you! Your message has been sent.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

/**
 * REACT CONCEPTS DEMONSTRATED:
 * 
 * 1. Controlled Components - Input values controlled by React state
 * 2. Form Handling - onSubmit, onChange events
 * 3. Event Types - FormEvent, ChangeEvent (TypeScript)
 * 4. Object State - Managing multiple related values in one state object
 * 5. Spread Operator - Copying objects while updating specific properties
 * 6. Computed Property Names - [name]: value syntax
 * 7. Destructuring - const { name, value } = e.target
 * 8. Conditional Rendering - && operator for showing/hiding elements
 * 9. setTimeout in React - Same as vanilla JS but within component context
 * 10. State Updates - Using previous state with callback function
 * 
 * ADDITIONAL TAILWIND MAPPINGS:
 * 
 * 11. width: 100% → w-full
 * 12. outline: none → focus:outline-none
 * 13. Focus states → focus: prefix (e.g., focus:border-blue-500)
 * 14. Arbitrary values → [20px] syntax for custom values
 * 15. Ring utility → focus:ring-2 focus:ring-blue-200 (focus ring effect)
 */
