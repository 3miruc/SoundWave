
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WorldMusicMap from '@/components/WorldMusicMap';
import { getMockTracks } from '@/services/spotifyService';

const Countries = () => {
  // Get background image from a mock track
  const mockTracks = getMockTracks();
  const backgroundImage = mockTracks[0]?.backgroundImage || mockTracks[0]?.albumArt;
  
  return (
    <div className="min-h-screen page-transition relative">
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-5">
          <img 
            src={backgroundImage}
            alt="Music background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="relative z-10">
        <Navbar />
        
        <Hero 
          title="Global Music Trends"
          subtitle="Explore popular music from countries around the world"
          className="min-h-[30vh]"
        />
        
        <div className="container mx-auto py-12">
          <WorldMusicMap />
        </div>
      </div>
    </div>
  );
};

export default Countries;
