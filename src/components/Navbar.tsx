
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';

interface NavbarProps {
  onSearch?: (results: any[]) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/charts', label: 'Charts' },
    { path: '/countries', label: 'Countries' }
  ];
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-black/85 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <NavLink to="/" className="text-2xl font-bold text-white">
            MusicApp
          </NavLink>
          
          <div className="flex items-center space-x-6 md:hidden">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "font-medium transition-colors",
                  isActive ? "text-primary" : "text-gray-400 hover:text-white"
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        
        {onSearch && <SearchBar onSearchResults={onSearch} className="my-2 md:my-0" />}
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "font-medium transition-colors",
                isActive ? "text-primary" : "text-gray-400 hover:text-white"
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
