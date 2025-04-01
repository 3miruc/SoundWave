
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { Headphones, Music, Globe, BarChart2, ListMusic, History, Search } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface NavbarProps {
  onSearch?: (results: any[]) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Home', icon: <Headphones className="h-4 w-4 mr-2" /> },
    { path: '/charts', label: 'Charts', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { path: '/countries', label: 'Countries', icon: <Globe className="h-4 w-4 mr-2" /> },
    { path: '/playlists', label: 'Playlists', icon: <ListMusic className="h-4 w-4 mr-2" /> },
    { path: '/history', label: 'History', icon: <History className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-black/85 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <NavLink to="/" className="text-2xl font-bold text-white flex items-center">
            <Music className="h-6 w-6 mr-2 text-primary" />
            MusicApp
          </NavLink>
          
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Toggle 
              pressed={showAdvancedSearch} 
              onPressedChange={() => setShowAdvancedSearch(!showAdvancedSearch)}
              aria-label="Toggle advanced search"
              className="ml-2"
            >
              <Search className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
        
        {onSearch && <SearchBar 
          onSearchResults={onSearch} 
          className="my-2 md:my-0 w-full md:w-auto md:max-w-md"
          showAdvanced={showAdvancedSearch} 
        />}
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "font-medium transition-colors flex items-center",
                isActive ? "text-primary" : "text-gray-400 hover:text-white"
              )}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <Toggle 
            pressed={showAdvancedSearch} 
            onPressedChange={() => setShowAdvancedSearch(!showAdvancedSearch)}
            aria-label="Toggle advanced search"
          >
            <Search className="h-4 w-4" />
          </Toggle>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
