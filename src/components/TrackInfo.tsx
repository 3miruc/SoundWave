
import React from 'react';
import BackgroundBlur from '@/components/BackgroundBlur';

interface TrackInfoProps {
  currentSong: {
    title: string;
    artist: string;
    albumName?: string;
    duration?: string;
    popularity?: number;
    audioUrl?: string;
  };
  isPlaying: boolean;
  handlePlayPause: () => void;
}

const TrackInfo = ({ currentSong, isPlaying, handlePlayPause }: TrackInfoProps) => {
  return (
    <BackgroundBlur
      className="p-8 rounded-xl"
      intensity="low"
      color="rgba(255, 255, 255, 0.5)"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{currentSong.title}</h1>
        <p className="text-xl text-gray-700">{currentSong.artist}</p>
        {currentSong.albumName && (
          <p className="text-gray-500 mt-1">Album: {currentSong.albumName}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={handlePlayPause}
          className="px-6 py-3 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          {isPlaying ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"/>
              </svg>
              Play
            </>
          )}
        </button>
        
        {currentSong.duration && (
          <span className="text-gray-600">
            Duration: {currentSong.duration}
          </span>
        )}
      </div>
      
      {currentSong.audioUrl ? (
        <audio 
          src={currentSong.audioUrl} 
          controls 
          className="w-full mb-6" 
          autoPlay={isPlaying}
        />
      ) : (
        <p className="mb-6 text-gray-500 italic">Preview not available for this track</p>
      )}
      
      {currentSong.popularity && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">Popularity</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-black h-2.5 rounded-full"
              style={{ width: `${currentSong.popularity}%` }}
            />
          </div>
        </div>
      )}
    </BackgroundBlur>
  );
};

export default TrackInfo;
