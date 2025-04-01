
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ListeningHistory from '@/components/ListeningHistory';
import MusicPlayer from '@/components/MusicPlayer';
import { toast } from '@/hooks/use-toast';
import { getMockTracks } from '@/services/spotifyService';

const History = () => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, fetch this from localStorage or a backend API
    const mockTracks = getMockTracks();
    
    // Create mock history with random timestamps within the last week
    const mockHistory = mockTracks.map(track => ({
      ...track,
      listenedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
    }));
    
    // Sort by most recent first
    mockHistory.sort((a, b) => b.listenedAt.getTime() - a.listenedAt.getTime());
    
    setHistory(mockHistory);
  }, []);
  
  const handlePlay = (id: string) => {
    const track = history.find(item => item.id === id);
    
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
    if (!currentSong) return;
    
    const currentIndex = history.findIndex(item => item.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < history.length - 1) {
      setCurrentSong(history[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const currentIndex = history.findIndex(item => item.id === currentSong.id);
    
    if (currentIndex > 0) {
      setCurrentSong(history[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    toast({
      description: "Listening history cleared",
    });
  };
  
  const handleRemoveItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
    toast({
      description: "Track removed from history",
    });
  };

  return (
    <div className="min-h-screen page-transition bg-background text-foreground">
      <Navbar />
      
      <div className="pt-24 pb-32 container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Listening History</h1>
        
        <ListeningHistory
          history={history}
          onPlay={handlePlay}
          onClearHistory={handleClearHistory}
          onRemoveItem={handleRemoveItem}
        />
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

export default History;
