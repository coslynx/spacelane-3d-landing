<structure>
```typescript
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThreeScene } from '../3d/ThreeScene';
import { ModelLoader } from '../3d/ModelLoader';
import { useTheme } from '../../context/ThemeContext';
import { useToggle } from '../../hooks/useToggle';
import { LucideIcon } from 'lucide-react';

export interface HeaderProps {
  logoSrc: string;
  navLinks: { text: string; href: string }[];
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  enableSearchBar?: boolean;
  threeDTitle?:boolean;
  ThreeDIcon?: LucideIcon;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc,
  navLinks,
  isAuthenticated,
  onLogin,
  onLogout,
  enableSearchBar = false,
  threeDTitle = false,
  ThreeDIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, toggleSearchBar] = useToggle(false);
  const headerRef = useRef<HTMLElement>(null);
  const {isDarkMode} = useTheme()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      console.log('Search submitted:', searchQuery);
    }
  };

  const handleScroll = useCallback(() => {
    if (headerRef.current) {
      const scrollPosition = window.scrollY;
      const threshold = 100;

      if (scrollPosition > threshold) {
        headerRef.current.classList.add('fixed', 'top-0', 'bg-white', 'shadow-md', 'dark:bg-gray-800');
        headerRef.current.classList.remove('relative', 'bg-transparent', 'shadow-none');
      } else {
        headerRef.current.classList.remove('fixed', 'top-0', 'bg-white', 'shadow-md', 'dark:bg-gray-800');
        headerRef.current.classList.add('relative', 'bg-transparent', 'shadow-none');
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <header
      ref={headerRef}
      className={`relative z-50 flex items-center justify-between py-4 px-6 transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}
    >
      <Link to="/" className="flex items-center">
        <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
        {threeDTitle && ThreeDIcon && <ThreeScene><ModelLoader modelPath ='/models/test.glb'/></ThreeScene>}
        <span className="ml-2 text-xl font-semibold">{threeDTitle && ThreeDIcon &&"  3D APP"}</span>
      </Link>
      <nav className="hidden md:flex space-x-4">
        {navLinks.map((link) => (
          <Link key={link.href} to={link.href} className="hover:text-gray-500">
            {link.text}
          </Link>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        {enableSearchBar && (
          <button onClick={toggleSearchBar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
        {isAuthenticated ? (
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">
            Logout
          </button>
        ) : (
          <button onClick={onLogin} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Login
          </button>
        )}
      </div>
      {isSearchBarVisible && (
        <form onSubmit={handleSearchSubmit} className="absolute top-full mt-2 right-0 md:right-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="py-2 px-4 rounded-l focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-r">
            Search
          </button>
        </form>
      )}
    </header>
  );
};

export default Header;