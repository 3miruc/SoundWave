
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WorldMusicMap from '@/components/WorldMusicMap';

const Countries = () => {
  return (
    <div className="min-h-screen page-transition">
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
  );
};

export default Countries;
