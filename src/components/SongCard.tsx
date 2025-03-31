
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
  youtubeUrl?: string;
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
  variant = 'default',
  youtubeUrl
}: SongCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePlay = () => {
    onPlay(id);
  };

  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "flex items-center p-3 rounded-md cursor-pointer group",
          isPlaying ? "bg-secondary" : "hover:bg-secondary",
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
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {isPlaying ? (
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 bg-primary rounded-full animate-pulse-soft"></span>
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
          <h3 className={cn("font-medium text-sm truncate", isPlaying && "text-primary")}>{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
        </div>
        
        <div className="flex items-center">
          {youtubeUrl && (
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition-colors mr-3 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="currentColor"/>
              </svg>
            </a>
          )}
          
          <div className="text-xs text-muted-foreground">
            {duration}
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'chart') {
    return (
      <div 
        className={cn(
          "flex items-center p-4 rounded-md cursor-pointer group",
          isPlaying ? "bg-secondary" : "hover:bg-secondary",
          className
        )}
        onClick={handlePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0 w-6 mr-4 text-center">
          <span className={cn("text-lg font-bold", isPlaying ? "text-primary" : "text-muted-foreground")}>{id}</span>
        </div>
        
        <div className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden mr-4">
          <img 
            src={albumArt} 
            alt={`${title} by ${artist}`} 
            className="w-full h-full object-cover"
          />
          {(isHovered || isPlaying) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {isPlaying ? (
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 bg-primary rounded-full animate-pulse-soft"></span>
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
          <h3 className={cn("font-medium truncate", isPlaying && "text-primary")}>{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        </div>
        
        <div className="flex items-center">
          {youtubeUrl && (
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition-colors mr-3 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="currentColor"/>
              </svg>
            </a>
          )}
          
          <div className="text-sm text-muted-foreground">
            {duration}
          </div>
        </div>
      </div>
    );
  }
  
  // Default variant - Spotify card style
  return (
    <div 
      className={cn(
        "spotify-card relative rounded-md overflow-hidden group",
        className
      )}
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden rounded-md p-4 pb-0">
        <div className="w-full h-full rounded-md overflow-hidden shadow-md">
          <img 
            src={albumArt} 
            alt={`${title} by ${artist}`} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </div>
        
        {(isHovered || isPlaying) && (
          <div 
            className={cn(
              "absolute bottom-3 right-3 rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center shadow-lg",
              "transform transition-all duration-200",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
            onClick={handlePlay}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"/>
              </svg>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className={cn("font-medium truncate", isPlaying && "text-primary")}>{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
          
          {youtubeUrl && (
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="currentColor"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
