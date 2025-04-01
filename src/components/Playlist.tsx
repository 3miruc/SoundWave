
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, MoreHorizontal, Trash2, Edit2, ListMusic, PlusCircle, Music } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  tracks: PlaylistItem[];
  createdAt: Date;
}

interface PlaylistProps {
  playlist: PlaylistData;
  onPlay: (trackId: string) => void;
  onRemoveTrack: (playlistId: string, trackId: string) => void;
  onEditPlaylist: (playlist: PlaylistData) => void;
  onDeletePlaylist: (playlistId: string) => void;
  className?: string;
}

const Playlist = ({
  playlist,
  onPlay,
  onRemoveTrack,
  onEditPlaylist,
  onDeletePlaylist,
  className
}: PlaylistProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRemoveTrack = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    onRemoveTrack(playlist.id, trackId);
    toast({
      description: "Track removed from playlist",
    });
  };

  const getTotalDuration = () => {
    let totalSeconds = 0;
    playlist.tracks.forEach(track => {
      const [minutes, seconds] = track.duration.split(':').map(Number);
      totalSeconds += minutes * 60 + seconds;
    });
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  return (
    <div className={cn("bg-card/30 backdrop-blur-md rounded-lg border border-white/5 overflow-hidden", className)}>
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-shrink-0 w-32 h-32 md:w-48 md:h-48 bg-black/50 rounded-md overflow-hidden shadow-md">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ListMusic className="h-16 w-16 text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">{playlist.name}</h1>
                <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{playlist.tracks.length} tracks</span>
                  <span className="mx-2">•</span>
                  <span>{getTotalDuration()}</span>
                  <span className="mx-2">•</span>
                  <span>Created {playlist.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-black/95 backdrop-blur-lg border border-white/10 rounded-md shadow-lg z-10 py-1">
                    <button
                      onClick={() => {
                        onEditPlaylist(playlist);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit playlist
                    </button>
                    <button
                      onClick={() => {
                        onDeletePlaylist(playlist.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-red-500 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => playlist.tracks.length > 0 && onPlay(playlist.tracks[0].id)}
                disabled={playlist.tracks.length === 0}
                className={cn(
                  "bg-primary text-white rounded-full px-6 py-2 flex items-center",
                  "hover:scale-105 transition-transform",
                  playlist.tracks.length === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <Play className="h-5 w-5 mr-2" />
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 p-4">
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-6">
            <Music className="h-12 w-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-lg font-medium mb-2">This playlist is empty</h3>
            <p className="text-gray-500 mb-4">Add some tracks to get started</p>
            <button className="text-primary flex items-center mx-auto">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add tracks
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center p-2 rounded-md hover:bg-white/5 transition-colors group"
                onClick={() => onPlay(track.id)}
              >
                <div className="w-6 text-gray-500 text-sm mr-3">{index + 1}</div>
                <img
                  src={track.albumArt}
                  alt={track.title}
                  className="w-10 h-10 object-cover rounded mr-3"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
                <div className="text-sm text-gray-500 mr-2">{track.duration}</div>
                <button
                  onClick={(e) => handleRemoveTrack(e, track.id)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-500 hover:text-white opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
