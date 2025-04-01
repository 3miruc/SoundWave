
import React from 'react';
import { cn } from '@/lib/utils';
import SongCard from './SongCard';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  youtubeUrl?: string;
}

interface TrendingSongsProps {
  songs: Song[];
  onPlay: (id: string) => void;
  currentlyPlaying?: string;
  className?: string;
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

const TrendingSongs = ({ 
  songs, 
  onPlay, 
  currentlyPlaying,
  className,
  title = "Trending Now",
  showViewMore = false,
  onViewMore
}: TrendingSongsProps) => {
  return (
    <div className={cn("py-8", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewMore && (
            <button 
              onClick={onViewMore}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors underline-animation"
            >
              View More
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              albumArt={song.albumArt}
              duration={song.duration}
              onPlay={onPlay}
              isPlaying={currentlyPlaying === song.id}
              youtubeUrl={song.youtubeUrl}
              className="animate-scale-in"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSongs;
