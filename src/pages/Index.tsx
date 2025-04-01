
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import TrendingSongs from '@/components/TrendingSongs';
import MusicPlayer from '@/components/MusicPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchResults from '@/components/SearchResults';
import { getTopTracks, getNewReleases, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Music, Disc } from 'lucide-react';
import { PlaylistData } from '@/components/Playlist';

const Index = () => {
  const [trendingSongs, setTrendingSongs] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [listeningHistory, setListeningHistory] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  
  // Popular music genres
  const genres = [
    'All', 'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country'
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [topTracks, releases] = await Promise.all([
          getTopTracks(10),
          getNewReleases(10)
        ]);
        
        setTrendingSongs(topTracks.length > 0 ? topTracks : getMockTracks());
        setNewReleases(releases.length > 0 ? releases : getMockTracks());
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setTrendingSongs(getMockTracks());
        setNewReleases(getMockTracks());
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load some data. Using sample data instead."
        });
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Load history and playlists from localStorage if available
    const savedHistory = localStorage.getItem('listeningHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        parsedHistory.forEach((item: any) => {
          item.listenedAt = new Date(item.listenedAt);
        });
        setListeningHistory(parsedHistory);
      } catch (e) {
        console.error('Error parsing listening history:', e);
      }
    }
    
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists);
        // Convert string dates back to Date objects
        parsedPlaylists.forEach((playlist: any) => {
          playlist.createdAt = new Date(playlist.createdAt);
        });
        setPlaylists(parsedPlaylists);
      } catch (e) {
        console.error('Error parsing playlists:', e);
      }
    }
  }, []);
  
  // Save history and playlists to localStorage when they change
  useEffect(() => {
    if (listeningHistory.length > 0) {
      localStorage.setItem('listeningHistory', JSON.stringify(listeningHistory));
    }
  }, [listeningHistory]);
  
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    }
  }, [playlists]);
  
  const handlePlay = (id: string) => {
    const allSongs = [...trendingSongs, ...newReleases, ...searchResults];
    const song = allSongs.find(song => song.id === id);
    
    if (song) {
      if (currentSong && currentSong.id === id) {
        // Toggle play/pause for current song
        setIsPlaying(!isPlaying);
      } else {
        // Play new song
        setCurrentSong(song);
        setIsPlaying(true);
        setPlayerMinimized(false);
        
        // Add to listening history
        const historyItem = {
          ...song,
          listenedAt: new Date()
        };
        
        // Remove duplicate if it exists and add to the beginning
        const filteredHistory = listeningHistory.filter(item => item.id !== song.id);
        setListeningHistory([historyItem, ...filteredHistory].slice(0, 50)); // Keep only the last 50 items
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
    if (!currentSong) return;
    
    const allSongs = [...trendingSongs, ...newReleases, ...searchResults];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      
      // Add to listening history
      const historyItem = {
        ...nextSong,
        listenedAt: new Date()
      };
      
      const filteredHistory = listeningHistory.filter(item => item.id !== nextSong.id);
      setListeningHistory([historyItem, ...filteredHistory].slice(0, 50));
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const allSongs = [...trendingSongs, ...newReleases, ...searchResults];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      const prevSong = allSongs[currentIndex - 1];
      setCurrentSong(prevSong);
      setIsPlaying(true);
      
      // Add to listening history
      const historyItem = {
        ...prevSong,
        listenedAt: new Date()
      };
      
      const filteredHistory = listeningHistory.filter(item => item.id !== prevSong.id);
      setListeningHistory([historyItem, ...filteredHistory].slice(0, 50));
    }
  };
  
  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };
  
  const closeSearchResults = () => {
    setShowSearchResults(false);
  };
  
  const handleGenreChange = (value: string) => {
    if (value === 'All' || value === selectedGenre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(value);
    }
  };
  
  const handleAddToPlaylist = (track: any) => {
    if (playlists.length === 0) {
      // If no playlists exist, create a default one
      const newPlaylist: PlaylistData = {
        id: Date.now().toString(),
        name: 'My Playlist',
        description: 'Created from favorited tracks',
        coverImage: track.albumArt,
        tracks: [track],
        createdAt: new Date()
      };
      
      setPlaylists([newPlaylist]);
      
      toast({
        title: "New playlist created",
        description: `${track.title} added to "My Playlist"`
      });
    } else {
      // Add to the first playlist (in a real app, you'd have a playlist selector)
      const updatedPlaylists = [...playlists];
      const targetPlaylist = updatedPlaylists[0];
      
      // Check if track already exists in the playlist
      if (targetPlaylist.tracks.some(t => t.id === track.id)) {
        toast({
          description: `${track.title} is already in "${targetPlaylist.name}"`
        });
        return;
      }
      
      targetPlaylist.tracks.push(track);
      setPlaylists(updatedPlaylists);
      
      toast({
        description: `${track.title} added to "${targetPlaylist.name}"`
      });
    }
  };
  
  // Filter songs by genre if a genre is selected
  const filteredTrendingSongs = selectedGenre 
    ? trendingSongs.filter(song => song.genre && song.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    : trendingSongs;
    
  const filteredNewReleases = selectedGenre
    ? newReleases.filter(song => song.genre && song.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    : newReleases;
  
  // Ensure YouTube URLs are passed to all songs
  const songsWithYoutubeLinks = (songs: any[]) => {
    return songs.map(song => ({
      ...song,
      youtubeUrl: song.youtubeUrl || `https://www.youtube.com/watch?v=${song.youtubeId}`
    }));
  };
  
  return (
    <div className="min-h-screen page-transition bg-background text-foreground">
      <Navbar onSearch={handleSearchResults} />
      
      {showSearchResults && (
        <SearchResults 
          results={songsWithYoutubeLinks(searchResults)}
          onPlay={handlePlay}
          onClose={closeSearchResults}
          currentlyPlaying={isPlaying ? currentSong?.id : undefined}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}
      
      <div className="pt-24 pb-32">
        <Hero 
          title="Découvrez de la Nouvelle Musique"
          subtitle="Écoutez les derniers titres et les meilleurs morceaux du monde entier"
          imageSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2074&ixlib=rb-4.0.3"
        />
        
        {loading ? (
          <LoadingSpinner message="Chargement de la musique..." />
        ) : (
          <div className="spotify-container">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Filter by Genre</h3>
              </div>
              <ToggleGroup type="single" value={selectedGenre || 'All'} onValueChange={handleGenreChange}>
                {genres.map(genre => (
                  <ToggleGroupItem key={genre} value={genre} className="capitalize">
                    {genre === 'All' ? (
                      <Music className="h-4 w-4 mr-2" />
                    ) : (
                      <Disc className="h-4 w-4 mr-2" />
                    )}
                    {genre}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            <TrendingSongs 
              title="Tendances Actuelles"
              songs={songsWithYoutubeLinks(filteredTrendingSongs)} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              showViewMore
              onViewMore={() => console.log('View more trending')}
            />
            
            <TrendingSongs 
              title="Nouvelles Sorties"
              songs={songsWithYoutubeLinks(filteredNewReleases)} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              className="mt-12"
              showViewMore
              onViewMore={() => console.log('View more releases')}
            />
            
            {listeningHistory.length > 0 && (
              <TrendingSongs 
                title="Recently Played"
                songs={songsWithYoutubeLinks(listeningHistory.slice(0, 5))}
                onPlay={handlePlay}
                currentlyPlaying={isPlaying ? currentSong?.id : undefined}
                className="mt-12"
                showViewMore
                onViewMore={() => window.location.href = '/history'}
              />
            )}
          </div>
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

export default Index;
