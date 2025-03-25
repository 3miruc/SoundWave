
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import TrendingSongs from '@/components/TrendingSongs';
import MusicPlayer from '@/components/MusicPlayer';
import { getTopTracks, getNewReleases, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [trendingSongs, setTrendingSongs] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [loading, setLoading] = useState(true);
  
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
    const song = [...trendingSongs, ...newReleases].find(song => song.id === id);
    
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
      toast.error('Unable to play this song.');
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (!currentSong) return;
    
    const allSongs = [...trendingSongs, ...newReleases];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < allSongs.length - 1) {
      setCurrentSong(allSongs[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const allSongs = [...trendingSongs, ...newReleases];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      setCurrentSong(allSongs[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  return (
    <div className="min-h-screen page-transition">
      <Navbar />
      
      <Hero 
        title="Discover New Music"
        subtitle="Listen to the latest and greatest songs from around the world"
        imageSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2074&ixlib=rb-4.0.3"
      />
      
      <div className="pb-24 md:pb-32">
        {loading ? (
          <div className="container mx-auto py-16 text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading amazing music...</p>
          </div>
        ) : (
          <>
            <TrendingSongs 
              title="Trending Now"
              songs={trendingSongs} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              showViewMore
              onViewMore={() => console.log('View more trending')}
            />
            
            <TrendingSongs 
              title="New Releases"
              songs={newReleases} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              className="mt-8"
              showViewMore
              onViewMore={() => console.log('View more releases')}
            />
          </>
        )}
      </div>
      
      {currentSong && (
        <MusicPlayer 
          currentSong={currentSong}
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
