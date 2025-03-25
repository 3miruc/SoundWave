
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import BackgroundBlur from './BackgroundBlur';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Charts', path: '/charts' },
    { name: 'Now Playing', path: '/now-playing' }
  ];

  return (
    <BackgroundBlur 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-3 shadow-md' : 'py-5'
      )}
      intensity="medium"
      color={scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)'}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse-soft" />
          </div>
          <span className="font-bold text-xl tracking-tight">SoundWave</span>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path}
                  className={cn(
                    "py-2 text-sm font-medium transition-colors",
                    location.pathname === link.path 
                      ? "text-black" 
                      : "text-gray-600 hover:text-black underline-animation"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="md:hidden">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </BackgroundBlur>
  );
};

export default Navbar;
