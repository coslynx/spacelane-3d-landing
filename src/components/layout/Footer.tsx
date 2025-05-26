import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface FooterProps {
  copyrightText?: string;
  socialLinks?: { icon: React.ComponentType; href: string; ariaLabel: string }[];
  legalLinks?: { text: string; href: string }[];
  contactInfo?: { label: string; value: string }[];
}

const Footer: React.FC<FooterProps> = ({
  copyrightText = '© 2024 Spacelane. All rights reserved.',
  socialLinks = [
    { icon: Facebook, href: '#', ariaLabel: 'Facebook' },
    { icon: Instagram, href: '#', ariaLabel: 'Instagram' },
    { icon: Twitter, href: '#', ariaLabel: 'Twitter' },
  ],
  legalLinks = [
    { text: 'Terms of Service', href: '#' },
    { text: 'Privacy Policy', href: '#' },
  ],
  contactInfo = [
    { label: 'Email', value: 'info@spacelane.com' },
    { label: 'Phone', value: '+1 (555) 123-4567' },
  ],
}) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <footer className={`bg-gray-100 dark:bg-gray-900 py-8 ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{copyrightText}</p>
          </div>
          <div>
            <ul className="flex justify-center space-x-4">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <link.icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="flex justify-end space-x-4">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 text-sm">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center">
          {contactInfo.map((item, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300 text-sm">
              {item.label}: {item.value}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;