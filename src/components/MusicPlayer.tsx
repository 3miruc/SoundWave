
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import BackgroundBlur from './BackgroundBlur';

interface MusicPlayerProps {
  currentSong: {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
    audioUrl: string;
  } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const MusicPlayer = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  className,
  minimized = false,
  onToggleMinimize
}: MusicPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      onNext();
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [onNext]);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };
  
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (!currentSong) return null;
  
  if (minimized) {
    return (
      <BackgroundBlur
        className={cn(
          "fixed bottom-0 left-0 right-0 px-4 py-3 z-40 shadow-lg",
          className
        )}
        intensity="medium"
        color="rgba(255, 255, 255, 0.9)"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center mr-4 min-w-0 flex-1">
              <img 
                src={currentSong.albumArt} 
                alt={`${currentSong.title} by ${currentSong.artist}`}
                className="w-10 h-10 rounded-md object-cover mr-3"
              />
              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
                <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
                onClick={onPrevious}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20L9 12L19 4V20Z" fill="currentColor"/>
                  <rect x="7" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
              
              <button 
                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
                onClick={onNext}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4L15 12L5 20V4Z" fill="currentColor"/>
                  <rect x="17" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
              
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
                onClick={onToggleMinimize}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-1 relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-black rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <audio ref={audioRef} src={currentSong.audioUrl} />
        </div>
      </BackgroundBlur>
    );
  }
  
  return (
    <BackgroundBlur
      className={cn(
        "fixed bottom-0 left-0 right-0 px-4 py-6 z-40 shadow-lg",
        className
      )}
      intensity="medium"
      color="rgba(255, 255, 255, 0.9)"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0 min-w-0 md:flex-1">
            <img 
              src={currentSong.albumArt} 
              alt={`${currentSong.title} by ${currentSong.artist}`}
              className="w-16 h-16 rounded-lg object-cover mr-4"
            />
            <div className="min-w-0">
              <h3 className="font-medium text-lg truncate">{currentSong.title}</h3>
              <p className="text-gray-500 truncate">{currentSong.artist}</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl">
            <div className="flex items-center space-x-4 justify-center mb-2">
              <button 
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
                onClick={onPrevious}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20L9 12L19 4V20Z" fill="currentColor"/>
                  <rect x="7" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
              
              <button 
                className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              
              <button 
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
                onClick={onNext}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4L15 12L5 20V4Z" fill="currentColor"/>
                  <rect x="17" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-10 text-right mr-2">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="h-1 flex-1 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-10 ml-2">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:justify-end md:flex-1">
            <button 
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black transition-colors rounded-full"
              onClick={onToggleMinimize}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9L12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={currentSong.audioUrl} />
    </BackgroundBlur>
  );
};

export default MusicPlayer;
