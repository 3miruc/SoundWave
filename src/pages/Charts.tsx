import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import MusicPlayer from '@/components/MusicPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getTopTracks, getCountryChart, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';

const Charts = () => {
  const [globalCharts, setGlobalCharts] = useState<any[]>([]);
  const [usCharts, setUsCharts] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [globalTracks, usTracks] = await Promise.all([
          getTopTracks(20),
          getCountryChart('US', 20)
        ]);
        
        setGlobalCharts(globalTracks.length > 0 ? globalTracks : getMockTracks());
        setUsCharts(usTracks.length > 0 ? usTracks : getMockTracks());
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setGlobalCharts(getMockTracks());
        setUsCharts(getMockTracks());
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chart data. Using sample data instead."
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handlePlay = (id: string) => {
    const song = [...globalCharts, ...usCharts].find(song => song.id === id);
    
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
    
    const allSongs = [...globalCharts, ...usCharts];
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < allSongs.length - 1) {
      setCurrentSong(allSongs[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const allSongs = [...globalCharts, ...usCharts];
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
        title="Charts"
        subtitle="Discover the most popular music from around the world"
        className="min-h-[50vh]"
      />
      
      <div className="pb-24 md:pb-32">
        {loading ? (
          <LoadingSpinner message="Loading chart data..." />
        ) : (
          <>
            <ChartSection 
              title="Global Top 20"
              description="The most popular songs on Spotify worldwide"
              songs={globalCharts} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              type="list"
            />
            
            <ChartSection 
              title="United States Top 20"
              description="The hottest tracks in the United States"
              songs={usCharts} 
              onPlay={handlePlay} 
              currentlyPlaying={isPlaying ? currentSong?.id : undefined}
              className="mt-12"
              type="list"
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

export default Charts;
