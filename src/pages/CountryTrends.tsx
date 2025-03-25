
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ChartSection from '@/components/ChartSection';
import MusicPlayer from '@/components/MusicPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCountryChart, getMockTracks } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';

// Country codes and names mapping
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'RU', name: 'Russia' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ZA', name: 'South Africa' }
];

const CountryTrends = () => {
  const [countryCharts, setCountryCharts] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(true);
  const [loading, setLoading] = useState(true);
  const { countryCode = 'US' } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  
  const countryName = countries.find(c => c.code === countryCode)?.name || countryCode;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const countryTracks = await getCountryChart(countryCode, 20);
        setCountryCharts(countryTracks.length > 0 ? countryTracks : getMockTracks());
        
        setLoading(false);
      } catch (error) {
        console.error(`Error loading ${countryName} chart data:`, error);
        setCountryCharts(getMockTracks());
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load ${countryName} chart data. Using sample data instead.`
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [countryCode, countryName]);
  
  const handlePlay = (id: string) => {
    const song = countryCharts.find(song => song.id === id);
    
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
    
    const currentIndex = countryCharts.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > -1 && currentIndex < countryCharts.length - 1) {
      setCurrentSong(countryCharts[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (!currentSong) return;
    
    const currentIndex = countryCharts.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      setCurrentSong(countryCharts[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/countries/${e.target.value}`);
  };
  
  return (
    <div className="min-h-screen page-transition">
      <Navbar />
      
      <Hero 
        title={`${countryName} Music Trends`}
        subtitle={`Discover the most popular music in ${countryName}`}
        className="min-h-[30vh]"
      />
      
      <div className="container mx-auto my-8">
        <div className="flex justify-end mb-6">
          <div className="flex items-center">
            <label htmlFor="country-select" className="mr-2 text-sm font-medium">
              Select Country:
            </label>
            <select
              id="country-select"
              className="bg-white border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={countryCode}
              onChange={handleCountryChange}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="pb-24 md:pb-32">
        {loading ? (
          <LoadingSpinner message={`Loading ${countryName} chart data...`} />
        ) : (
          <ChartSection 
            title={`${countryName} Top 20`}
            description={`The most popular songs in ${countryName}`}
            songs={countryCharts} 
            onPlay={handlePlay} 
            currentlyPlaying={isPlaying ? currentSong?.id : undefined}
            type="list"
          />
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

export default CountryTrends;
