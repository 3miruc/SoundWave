
import React from 'react';
import SongCard from '@/components/SongCard';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

interface RelatedTracksProps {
  tracks: Track[];
  onPlay: (id: string) => void;
  currentlyPlaying?: { id: string; isPlaying: boolean };
}

const RelatedTracks = ({ tracks, onPlay, currentlyPlaying }: RelatedTracksProps) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tracks.map(track => (
          <SongCard
            key={track.id}
            id={track.id}
            title={track.title}
            artist={track.artist}
            albumArt={track.albumArt}
            duration={track.duration}
            onPlay={onPlay}
            isPlaying={currentlyPlaying?.isPlaying && currentlyPlaying.id === track.id}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedTracks;
