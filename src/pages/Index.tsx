
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import TrendingSongs from '@/components/TrendingSongs';
import MusicPlayer from '@/components/MusicPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchResults from '@/components/SearchResults';
import { getTopTracks, getNewReleases, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [trendingSongs, setTrendingSongs] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
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
  }, []);
  
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
      setCurrentSong(allSongs[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const allSongs = [...trendingSongs, ...newReleases, ...searchResults];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      setCurrentSong(allSongs[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };
  
  const closeSearchResults = () => {
    setShowSearchResults(false);
  };
  
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
            <TrendingSongs 
              title="Tendances Actuelles"
              songs={songsWithYoutubeLinks(trendingSongs)} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              showViewMore
              onViewMore={() => console.log('View more trending')}
            />
            
            <TrendingSongs 
              title="Nouvelles Sorties"
              songs={songsWithYoutubeLinks(newReleases)} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              className="mt-12"
              showViewMore
              onViewMore={() => console.log('View more releases')}
            />
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
