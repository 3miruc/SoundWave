
import React from 'react';
import BackgroundBlur from '@/components/BackgroundBlur';

interface AlbumCoverProps {
  albumArt: string;
  title: string;
  artist: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AlbumCover = ({ albumArt, title, artist, isPlaying, onPlayPause }: AlbumCoverProps) => {
  return (
    <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-2xl">
      <img 
        src={albumArt} 
        alt={`${title} by ${artist}`}
        className={`w-full h-full object-cover ${isPlaying ? 'album-rotation' : ''}`}
      />
      <BackgroundBlur
        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
        intensity="medium"
        color="rgba(0, 0, 0, 0.4)"
      >
        <button
          onClick={onPlayPause}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="4" height="16" fill="black"/>
              <rect x="14" y="4" width="4" height="16" fill="black"/>
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14v14l11-7-11-7z" fill="black"/>
            </svg>
          )}
        </button>
      </BackgroundBlur>
    </div>
  );
};

export default AlbumCover;
