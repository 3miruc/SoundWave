
import React from 'react';
import { cn } from '@/lib/utils';
import BackgroundBlur from './BackgroundBlur';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  className?: string;
}

const Hero = ({ 
  title, 
  subtitle,
  imageSrc,
  className 
}: HeroProps) => {
  return (
    <div className={cn(
      "relative min-h-[70vh] flex items-center justify-center overflow-hidden",
      className
    )}>
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSrc} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
      )}
      
      <BackgroundBlur 
        className="relative z-10 max-w-4xl mx-auto text-center px-6 py-16 rounded-2xl"
        intensity="low"
        color="rgba(255, 255, 255, 0.1)"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-down subtle-text-shadow">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto animate-fade-in delay-75 subtle-text-shadow">
          {subtitle}
        </p>
      </BackgroundBlur>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default Hero;
