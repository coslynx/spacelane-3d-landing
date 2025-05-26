import React, { Suspense, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ModelShowcasePage from './pages/ModelShowcasePage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import './styles/base.css';
import './styles/index.css';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const handleLogin = useCallback(() => {
    console.log('Login clicked');
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logout clicked');
  }, []);

  const logoSrc = '/favicon.svg';

  const navLinks = [
    { text: 'About', href: '/about' },
    { text: 'Experience', href: '/experience' },
    { text: 'Model Showcase', href: '/model-showcase' },
    { text: 'Contact', href: '/contact' },
  ];

  const copyrightText = `© ${new Date().getFullYear()} Spacelane. All rights reserved.`;

  const socialLinks = [
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, href: '#', ariaLabel: 'Facebook' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: '#', ariaLabel: 'Instagram' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4.01c-1 .49-1.98.86-3 1.16 1.08-.64 1.8-1.66 2.2-2.86-1 .59-2.09.96-3.2 1.24C14.07 2.34 12.9 1.75 11.71 1.75c-2.09 0-3.8 1.69-3.8 3.75 0 .29.04.57.12.84C5.57 5.97 3.48 4.22 2 2.58c-.7.36-1.38.75-1.95 1.12C3.4 8.36 6.67 10.79 10.12 11.04c-.81-.08-1.57-.25-2.28-.51-.07.94.65 1.75 1.49 1.92-.62-.04-1.21-.19-1.72-.48.43.79 1.67 1.36 3.03 1.38-1.12.93-2.54 1.49-4.06 1.49-.26 0-.52-.02-.79-.04 1.57.91 3.45 1.45 5.42 1.45 6.49 0 10.07-5.38 10.07-10.07 0-.15-.02-.29-.04-.43C20.59 5.13 21.54 4.43 22 4.01z"/></svg>, href: '#', ariaLabel: 'Twitter' },
  ];

  const legalLinks = [
    { text: 'Terms of Service', href: '#' },
    { text: 'Privacy Policy', href: '#' },
  ];

  const contactInfo = [
    { label: 'Email', value: 'info@spacelane.com' },
    { label: 'Phone', value: '+1 (555) 123-4567' },
  ];

  return (
    <BrowserRouter>
        <Header
          logoSrc={logoSrc}
          navLinks={navLinks}
          isAuthenticated={false}
          onLogin={handleLogin}
          onLogout={handleLogout}
          enableSearchBar={true}
          threeDTitle={true}
          ThreeDIcon={() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
        />
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/model-showcase" element={<ModelShowcasePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<LandingHero
              modelPath="/models/test.glb"
              headline="Transform Your Digital Space"
              description="Experience a new dimension of design with our innovative SaaS product."
              ctaText="Start Creating Now"
              onCtaClick={() => console.log('CTA Clicked')}
            />} />
        </Routes>
        <Footer
          copyrightText={copyrightText}
          socialLinks={socialLinks}
          legalLinks={legalLinks}
          contactInfo={contactInfo}
        />
    </BrowserRouter>
  );
};

export default App;