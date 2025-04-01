
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Music, User, Disc, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
  className?: string;
  showAdvanced?: boolean;
}

const SearchBar = ({ onSearchResults, className, showAdvanced = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchType, setSearchType] = useState('track');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const genres = [
    'pop', 'rock', 'rap', 'electronic', 'jazz', 'classical', 'r&b', 'country', 'indie'
  ];

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive"
        });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    try {
      // In a real app, you would fetch from your API with the appropriate search parameters
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}${selectedGenre ? `&genre=${selectedGenre}` : ''}`);
      let results = [];
      
      // Using mock data for demonstration
      const mockResults = Array(10).fill(null).map((_, i) => ({
        id: `track-${i}`,
        title: `${searchQuery} Track ${i + 1}${selectedGenre ? ` (${selectedGenre})` : ''}`,
        artist: `Artist ${i + 1}`,
        albumArt: `https://picsum.photos/seed/${searchQuery}${i}/200/200`,
        duration: '3:45',
        youtubeId: 'dQw4w9WgXcQ',
        type: searchType
      }));
      
      results = mockResults;
      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };
  
  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="relative">
        <div className="flex items-center bg-black/40 border border-white/10 rounded-full overflow-hidden pl-4 pr-1 focus-within:border-primary">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for music..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none py-2 px-3 text-white placeholder:text-gray-500"
          />
          <button
            onClick={toggleListening}
            className={cn(
              "p-2 rounded-full focus:outline-none transition-colors",
              isListening ? "text-primary animate-pulse" : "text-gray-400 hover:text-white"
            )}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleSearch()}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors ml-1"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="mt-2 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10 animate-fade-in">
          <div className="mb-2">
            <p className="text-sm text-gray-400 mb-1">Search by:</p>
            <ToggleGroup type="single" value={searchType} onValueChange={(value) => value && setSearchType(value)}>
              <ToggleGroupItem value="track" aria-label="Search tracks">
                <Music className="h-4 w-4 mr-1" />
                Tracks
              </ToggleGroupItem>
              <ToggleGroupItem value="artist" aria-label="Search artists">
                <User className="h-4 w-4 mr-1" />
                Artists
              </ToggleGroupItem>
              <ToggleGroupItem value="album" aria-label="Search albums">
                <Disc className="h-4 w-4 mr-1" />
                Albums
              </ToggleGroupItem>
              <ToggleGroupItem value="playlist" aria-label="Search playlists">
                <ListMusic className="h-4 w-4 mr-1" />
                Playlists
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Filter by genre:</p>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <Toggle
                  key={genre}
                  pressed={selectedGenre === genre}
                  onPressedChange={() => handleGenreSelect(genre)}
                  className="text-xs capitalize"
                  size="sm"
                >
                  {genre}
                </Toggle>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
