
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Playlist, { PlaylistData, PlaylistItem } from '@/components/Playlist';
import PlaylistForm from '@/components/PlaylistForm';
import MusicPlayer from '@/components/MusicPlayer';
import { toast } from '@/hooks/use-toast';
import { getMockTracks } from '@/services/spotifyService';
import { PlusCircle, ListMusic } from 'lucide-react';

const Playlists = () => {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch this from localStorage or a backend API
    const mockTracks = getMockTracks();
    
    // Create some example playlists
    const mockPlaylists: PlaylistData[] = [
      {
        id: '1',
        name: 'My Favorite Tracks',
        description: 'A collection of my all-time favorite songs',
        coverImage: 'https://picsum.photos/seed/playlist1/300/300',
        tracks: mockTracks.slice(0, 5),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        id: '2',
        name: 'Workout Mix',
        description: 'High energy tracks for the gym',
        coverImage: 'https://picsum.photos/seed/playlist2/300/300',
        tracks: mockTracks.slice(5, 8),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ];
    
    setPlaylists(mockPlaylists);
    
    // Set the first playlist as selected by default
    if (mockPlaylists.length > 0) {
      setSelectedPlaylist(mockPlaylists[0]);
    }
  }, []);
  
  const handlePlay = (id: string) => {
    // Find the track in any playlist
    let track: PlaylistItem | undefined;
    for (const playlist of playlists) {
      track = playlist.tracks.find(t => t.id === id);
      if (track) break;
    }
    
    if (track) {
      if (currentSong && currentSong.id === id) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSong(track);
        setIsPlaying(true);
        setPlayerMinimized(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to play this song."
      });
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (!currentSong || !selectedPlaylist) return;
    
    const currentIndex = selectedPlaylist.tracks.findIndex(track => track.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < selectedPlaylist.tracks.length - 1) {
      setCurrentSong(selectedPlaylist.tracks[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong || !selectedPlaylist) return;
    
    const currentIndex = selectedPlaylist.tracks.findIndex(track => track.id === currentSong.id);
    
    if (currentIndex > 0) {
      setCurrentSong(selectedPlaylist.tracks[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const handleRemoveTrack = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(track => track.id !== trackId)
        };
      }
      return playlist;
    }));
    
    // Also update the selected playlist if needed
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist({
        ...selectedPlaylist,
        tracks: selectedPlaylist.tracks.filter(track => track.id !== trackId)
      });
    }
  };
  
  const handleCreatePlaylist = (playlistData: Partial<PlaylistData>) => {
    const newPlaylist: PlaylistData = {
      id: Date.now().toString(),
      name: playlistData.name || 'New Playlist',
      description: playlistData.description || '',
      coverImage: playlistData.coverImage || '',
      tracks: playlistData.tracks || [],
      createdAt: new Date()
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setSelectedPlaylist(newPlaylist);
    setShowCreateForm(false);
    
    toast({
      description: "Playlist created successfully",
    });
  };
  
  const handleEditPlaylist = (playlistData: Partial<PlaylistData>) => {
    if (!playlistData.id) return;
    
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistData.id) {
        return {
          ...playlist,
          name: playlistData.name || playlist.name,
          description: playlistData.description || playlist.description,
          coverImage: playlistData.coverImage || playlist.coverImage
        };
      }
      return playlist;
    }));
    
    // Also update the selected playlist if needed
    if (selectedPlaylist && selectedPlaylist.id === playlistData.id) {
      setSelectedPlaylist({
        ...selectedPlaylist,
        name: playlistData.name || selectedPlaylist.name,
        description: playlistData.description || selectedPlaylist.description,
        coverImage: playlistData.coverImage || selectedPlaylist.coverImage
      });
    }
    
    setShowEditForm(false);
    
    toast({
      description: "Playlist updated successfully",
    });
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    
    // If the deleted playlist is the selected one, select another one
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      const remainingPlaylists = playlists.filter(p => p.id !== playlistId);
      setSelectedPlaylist(remainingPlaylists.length > 0 ? remainingPlaylists[0] : null);
    }
    
    toast({
      description: "Playlist deleted successfully",
    });
  };

  return (
    <div className="min-h-screen page-transition bg-background text-foreground">
      <Navbar />
      
      <div className="pt-24 pb-32 container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Playlists</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white rounded-full px-4 py-2 flex items-center hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Playlist
          </button>
        </div>
        
        {playlists.length === 0 && !showCreateForm ? (
          <div className="text-center py-16 bg-card/30 rounded-lg border border-white/5">
            <ListMusic className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No playlists yet</h2>
            <p className="text-gray-400 mb-6">Create your first playlist to start organizing your music</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary text-white rounded-full px-6 py-2 flex items-center mx-auto hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Playlist
            </button>
          </div>
        ) : (
          <>
            {showCreateForm ? (
              <PlaylistForm
                onSubmit={handleCreatePlaylist}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : showEditForm && selectedPlaylist ? (
              <PlaylistForm
                existingPlaylist={selectedPlaylist}
                onSubmit={handleEditPlaylist}
                onCancel={() => setShowEditForm(false)}
              />
            ) : (
              <>
                {playlists.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {playlists.map(playlist => (
                      <div
                        key={playlist.id}
                        className={`bg-card/30 backdrop-blur-md rounded-lg overflow-hidden border hover:border-primary/50 transition-colors cursor-pointer ${
                          selectedPlaylist?.id === playlist.id ? 'border-primary' : 'border-white/5'
                        }`}
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <div className="aspect-square bg-black/50 relative overflow-hidden">
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
                        <div className="p-3">
                          <h3 className="font-semibold text-lg truncate">{playlist.name}</h3>
                          <p className="text-sm text-gray-400 truncate">{playlist.tracks.length} tracks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedPlaylist && (
                  <Playlist
                    playlist={selectedPlaylist}
                    onPlay={handlePlay}
                    onRemoveTrack={handleRemoveTrack}
                    onEditPlaylist={() => setShowEditForm(true)}
                    onDeletePlaylist={handleDeletePlaylist}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {currentSong && (
        <MusicPlayer 
          currentSong={{
            ...currentSong,
            youtubeUrl: currentSong.youtubeUrl || `https://www.youtube.com/watch?v=${currentSong.youtubeId}`
          }}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          minimized={playerMinimized}
          onToggleMinimize={() => setPlayerMinimized(!playerMinimized)}
        />
      )}
    </div>
  );
};

export default Playlists;
