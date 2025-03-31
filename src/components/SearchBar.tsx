
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, MicOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { searchTracks } from '@/services/spotifyService';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
  className?: string;
}

const SearchBar = ({ onSearchResults, className }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const results = await searchTracks(query);
      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Erreur de recherche",
        description: "Impossible de trouver des résultats pour cette recherche."
      });
    } finally {
      setLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.lang = 'fr-FR';
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      
      newRecognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Écoute en cours",
          description: "Dites le nom d'une chanson ou d'un artiste..."
        });
      };
      
      newRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setTimeout(async () => {
          try {
            setLoading(true);
            const results = await searchTracks(transcript);
            onSearchResults(results);
          } catch (error) {
            console.error('Search error after voice recognition:', error);
          } finally {
            setLoading(false);
          }
        }, 500);
      };
      
      newRecognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'accéder au micro ou de reconnaître la voix."
        });
      };
      
      newRecognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(newRecognition);
      newRecognition.start();
    } else {
      toast({
        variant: "destructive",
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur."
      });
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cn("flex items-center space-x-2 w-full max-w-xl mx-auto", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Rechercher une chanson, un artiste..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10 bg-secondary/40 border-secondary"
          disabled={loading}
        />
      </div>
      
      <Button 
        onClick={handleSearch} 
        variant="outline" 
        size="icon" 
        disabled={loading}
        className="bg-secondary/40 hover:bg-secondary/60 border-secondary"
      >
        <Search className="h-5 w-5" />
      </Button>
      
      <Button 
        onClick={handleVoiceToggle} 
        variant="outline" 
        size="icon"
        className={cn(
          "bg-secondary/40 hover:bg-secondary/60 border-secondary",
          isListening && "bg-primary/30 text-primary-foreground"
        )}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-secondary/40 hover:bg-secondary/60 border-secondary"
          >
            Shazam
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Qu'est-ce qui joue ?</h3>
            <p className="text-sm text-muted-foreground">
              Cliquez sur le bouton ci-dessous pour identifier une chanson qui joue près de vous.
            </p>
            <Button 
              onClick={() => {
                toast({
                  title: "Information",
                  description: "La fonctionnalité d'identification audio complète nécessite une API comme Shazam. Pour l'instant, utilisez la reconnaissance vocale."
                });
                startVoiceRecognition();
              }}
              className="w-full"
            >
              <Mic className="mr-2 h-4 w-4" />
              Identifier la musique
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
