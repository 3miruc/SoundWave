
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  onPlay: (id: string) => void;
  isPlaying?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'chart';
}

const SongCard = ({ 
  id, 
  title, 
  artist, 
  albumArt, 
  duration, 
  onPlay,
  isPlaying = false,
  className,
  variant = 'default'
}: SongCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePlay = () => {
    onPlay(id);
  };

  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "flex items-center p-3 rounded-lg hover-scale cursor-pointer",
          isPlaying ? "bg-black/5" : "hover:bg-black/5",
          className
        )}
        onClick={handlePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-3">
          <img 
            src={albumArt} 
            alt={`${title} by ${artist}`} 
            className="w-full h-full object-cover"
          />
          {(isHovered || isPlaying) && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {isPlaying ? (
                <div className="w-4 h-4 relative">
                  <span className="absolute inset-0 flex items-center justify-center animate-pulse-soft">
                    ▶︎
                  </span>
                </div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.14v14l11-7-11-7z" fill="white"/>
                </svg>
              )}
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm truncate">{title}</h3>
          <p className="text-xs text-gray-500 truncate">{artist}</p>
        </div>
        
        <div className="text-xs text-gray-400 ml-2">
          {duration}
        </div>
      </div>
    );
  }
  
  if (variant === 'chart') {
    return (
      <div 
        className={cn(
          "flex items-center p-4 rounded-lg hover-scale cursor-pointer",
          isPlaying ? "bg-black/5" : "hover:bg-black/5",
          className
        )}
        onClick={handlePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0 w-6 mr-4 text-center">
          <span className="text-lg font-bold text-gray-400">{id}</span>
        </div>
        
        <div className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden mr-4">
          <img 
            src={albumArt} 
            alt={`${title} by ${artist}`} 
            className="w-full h-full object-cover"
          />
          {(isHovered || isPlaying) && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {isPlaying ? (
                <div className="w-4 h-4 relative">
                  <span className="absolute inset-0 flex items-center justify-center animate-pulse-soft">
                    ▶︎
                  </span>
                </div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.14v14l11-7-11-7z" fill="white"/>
                </svg>
              )}
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-sm text-gray-500 truncate">{artist}</p>
        </div>
        
        <div className="text-sm text-gray-400 ml-2">
          {duration}
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden hover-scale cursor-pointer",
        className
      )}
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden rounded-xl">
        <img 
          src={albumArt} 
          alt={`${title} by ${artist}`} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        {(isHovered || isPlaying) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className={cn(
              "w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transform transition-all",
              isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}>
              {isPlaying ? (
                <div className="w-4 h-4 relative">
                  <span className="absolute inset-0 flex items-center justify-center animate-pulse-soft">
                    ▶︎
                  </span>
                </div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.14v14l11-7-11-7z" fill="black"/>
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="font-medium truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
