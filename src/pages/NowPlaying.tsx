
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getTrackDetails, getTopTracks, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';
import BackgroundBlur from '@/components/BackgroundBlur';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlbumCover from '@/components/AlbumCover';
import TrackInfo from '@/components/TrackInfo';
import RelatedTracks from '@/components/RelatedTracks';

const NowPlaying = () => {
  const location = useLocation();
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [relatedTracks, setRelatedTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get trackId from URL params
  const params = new URLSearchParams(location.search);
  const trackId = params.get('id');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If we have a track ID in the URL, fetch that track
        if (trackId) {
          const track = await getTrackDetails(trackId);
          if (track) {
            setCurrentSong(track);
            setIsPlaying(true);
          } else {
            // Use first mock track if track not found
            const mockTracks = getMockTracks();
            setCurrentSong(mockTracks[0]);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not load the requested track. Using a sample track instead."
            });
          }
        } else {
          // If no track ID, use the first trending track
          const tracks = await getTopTracks(1);
          if (tracks.length > 0) {
            setCurrentSong(tracks[0]);
          } else {
            // Use first mock track if API fails
            const mockTracks = getMockTracks();
            setCurrentSong(mockTracks[0]);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not load the current track. Using a sample track instead."
            });
          }
        }
        
        // Get related tracks (using top tracks as a proxy)
        const related = await getTopTracks(5);
        if (related.length > 0) {
          setRelatedTracks(related);
        } else {
          setRelatedTracks(getMockTracks().slice(0, 5));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading now playing data:', error);
        const mockTracks = getMockTracks();
        setCurrentSong(mockTracks[0]);
        setRelatedTracks(mockTracks.slice(1, 6));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load track data. Using sample data instead."
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trackId]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handlePlayRelated = (id: string) => {
    const track = relatedTracks.find(track => track.id === id);
    if (track) {
      setCurrentSong(track);
      setIsPlaying(true);
    }
  };
  
  if (loading || !currentSong) {
    return (
      <div className="min-h-screen page-transition">
        <Navbar />
        <LoadingSpinner message="Loading track..." />
      </div>
    );
  }
  
  const backgroundImage = currentSong.backgroundImage || currentSong.albumArt;
  
  return (
    <div className="min-h-screen page-transition">
      <Navbar />
      
      <div className="relative min-h-screen pt-24 pb-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-16">
              <AlbumCover 
                albumArt={currentSong.albumArt}
                title={currentSong.title}
                artist={currentSong.artist}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </div>
            
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <TrackInfo 
                currentSong={currentSong}
                isPlaying={isPlaying}
                handlePlayPause={handlePlayPause}
              />
            </div>
          </div>
          
          <RelatedTracks 
            tracks={relatedTracks}
            onPlay={handlePlayRelated}
            currentlyPlaying={{ id: currentSong.id, isPlaying }}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
