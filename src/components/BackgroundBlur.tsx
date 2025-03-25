
import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundBlurProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}

const BackgroundBlur = ({ 
  children, 
  className,
  intensity = 'medium',
  color = 'rgba(255, 255, 255, 0.5)'
}: BackgroundBlurProps) => {
  const blurIntensity = {
    low: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    high: 'backdrop-blur-xl'
  };
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      <div 
        className={cn(
          'absolute inset-0 -z-10',
          blurIntensity[intensity]
        )}
        style={{ backgroundColor: color }}
      />
      {children}
    </div>
  );
};

export default BackgroundBlur;
