
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SearchResultsProps {
  results: any[];
  onPlay: (id: string) => void;
  onClose: () => void;
  currentlyPlaying?: string;
  className?: string;
}

const SearchResults = ({ 
  results, 
  onPlay, 
  onClose,
  currentlyPlaying,
  className 
}: SearchResultsProps) => {
  
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "fixed inset-x-0 top-16 mx-auto z-50 max-w-4xl p-4 rounded-lg",
      "bg-black/90 backdrop-blur-md border border-white/10 shadow-lg",
      "max-h-[70vh] overflow-y-auto",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Résultats de recherche</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {results.map((track) => (
          <div 
            key={track.id}
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer",
              currentlyPlaying === track.id && "bg-primary/20"
            )}
            onClick={() => onPlay(track.id)}
          >
            <img 
              src={track.albumArt} 
              alt={track.title}
              className="w-12 h-12 object-cover rounded mr-3" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{track.title}</h4>
              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            </div>
            <div className="text-xs text-gray-500 ml-3">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
