
import React from 'react';
import { cn } from '@/lib/utils';
import SongCard from './SongCard';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  rank?: number;
  youtubeUrl?: string;
}

interface ChartSectionProps {
  songs: Song[];
  onPlay: (id: string) => void;
  currentlyPlaying?: string;
  className?: string;
  title: string;
  description?: string;
  type?: 'grid' | 'list';
}

const ChartSection = ({ 
  songs, 
  onPlay, 
  currentlyPlaying,
  className,
  title,
  description,
  type = 'list'
}: ChartSectionProps) => {
  return (
    <div className={cn("py-8", className)}>
      <div className="container mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        
        {type === 'list' ? (
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            {songs.map((song, index) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title}
                artist={song.artist}
                albumArt={song.albumArt}
                duration={song.duration}
                onPlay={() => onPlay(song.id)}
                isPlaying={currentlyPlaying === song.id}
                variant="chart"
                youtubeUrl={song.youtubeUrl}
                className={index < songs.length - 1 ? "border-b" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {songs.map((song, index) => (
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSection;
