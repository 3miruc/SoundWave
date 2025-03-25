
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getTrackDetails, getTopTracks, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';
import BackgroundBlur from '@/components/BackgroundBlur';
import SongCard from '@/components/SongCard';

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
            toast.error('Could not load the requested track. Using a sample track instead.');
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
            toast.error('Could not load the current track. Using a sample track instead.');
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
        toast.error('Failed to load track data. Using sample data instead.');
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
        <div className="container mx-auto py-32 text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading track...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen page-transition">
      <Navbar />
      
      <div className="relative min-h-screen pt-24 pb-16">
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src={currentSong.albumArt} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-16">
              <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={currentSong.albumArt} 
                  alt={`${currentSong.title} by ${currentSong.artist}`}
                  className={`w-full h-full object-cover ${isPlaying ? 'album-rotation' : ''}`}
                />
                <BackgroundBlur
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                  intensity="medium"
                  color="rgba(0, 0, 0, 0.4)"
                >
                  <button
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="black"/>
                        <rect x="14" y="4" width="4" height="16" fill="black"/>
                      </svg>
                    ) : (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5.14v14l11-7-11-7z" fill="black"/>
                      </svg>
                    )}
                  </button>
                </BackgroundBlur>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <BackgroundBlur
                className="p-8 rounded-xl"
                intensity="low"
                color="rgba(255, 255, 255, 0.5)"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{currentSong.title}</h1>
                  <p className="text-xl text-gray-700">{currentSong.artist}</p>
                  {currentSong.albumName && (
                    <p className="text-gray-500 mt-1">Album: {currentSong.albumName}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-8">
                  <button
                    onClick={handlePlayPause}
                    className="px-6 py-3 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"/>
                        </svg>
                        Play
                      </>
                    )}
                  </button>
                  
                  {currentSong.duration && (
                    <span className="text-gray-600">
                      Duration: {currentSong.duration}
                    </span>
                  )}
                </div>
                
                {currentSong.audioUrl ? (
                  <audio 
                    src={currentSong.audioUrl} 
                    controls 
                    className="w-full mb-6" 
                    autoPlay={isPlaying}
                  />
                ) : (
                  <p className="mb-6 text-gray-500 italic">Preview not available for this track</p>
                )}
                
                {currentSong.popularity && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-1">Popularity</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-black h-2.5 rounded-full"
                        style={{ width: `${currentSong.popularity}%` }}
                      />
                    </div>
                  </div>
                )}
              </BackgroundBlur>
            </div>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedTracks.map(track => (
                <SongCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  albumArt={track.albumArt}
                  duration={track.duration}
                  onPlay={handlePlayRelated}
                  isPlaying={isPlaying && currentSong.id === track.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
