/**
 * src/pages/ContactPage.tsx
 *
 * Description: Implements the contact page for the 3D landing page, showcasing
 * contact information and a functional contact form. This page may
 * optionally feature subtle 3D decorative elements to enhance the user
 * experience while maintaining performance and accessibility.
 *
 * Core Dependencies: React, Three.js, React Three Fiber, Tailwind CSS.
 *
 * Architecture: Adheres to the project's component-based architecture,
 * utilizing layout components, UI primitives, and potentially custom hooks
 * for managing state and side effects.
 *
 * Integration: Integrates with the ThemeContext for theme-aware styling
 * and follows the project's established coding conventions.
 */
import React, { useState, useCallback } from 'react';
import { ThreeScene } from '../3d/ThreeScene';
import { ModelLoader } from '../3d/ModelLoader';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '../components/ui/common/Typography';
import { Button } from '../components/ui/core/Button';
import MinimalLayout from '../components/layout/MinimalLayout';

interface ContactPageProps {}

const ContactPage: React.FC<ContactPageProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const { isDarkMode } = useTheme();

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors: { name: string; email: string; message: string } = { name: '', email: '', message: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [name, email, message]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted', { name, email, message });
    }
  }, [name, email, message, validateForm]);

  return (
    <MinimalLayout>
      <div className="flex flex-col items-center justify-center p-6">
        <Typography variant="heading" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Contact Us
        </Typography>
        <div className="flex items-center justify-center">
          <ThreeScene cameraPosition={[0, 1, 3]}>
            <ModelLoader path="/models/test.glb" />
          </ThreeScene>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
              Message:
            </label>
            <textarea
              id="message"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.message ? 'border-red-500' : ''}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
            />
            {errors.message && <p className="text-red-500 text-xs italic">{errors.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <Button label="Submit" onClick={handleSubmit} variant="primary" size="md" />
          </div>
        </form>
      </div>
    </MinimalLayout>
  );
};

export default ContactPage;