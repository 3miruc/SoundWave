
import React from 'react';
import { cn } from '@/lib/utils';
import { X, Music, User, Disc, ListMusic, Plus, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SearchResultsProps {
  results: any[];
  onPlay: (id: string) => void;
  onClose: () => void;
  currentlyPlaying?: string;
  className?: string;
  onAddToPlaylist?: (item: any) => void;
}

const SearchResults = ({ 
  results, 
  onPlay, 
  onClose,
  currentlyPlaying,
  className,
  onAddToPlaylist
}: SearchResultsProps) => {
  
  if (results.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <User className="h-4 w-4 text-gray-400" />;
      case 'album':
        return <Disc className="h-4 w-4 text-gray-400" />;
      case 'playlist':
        return <ListMusic className="h-4 w-4 text-gray-400" />;
      case 'track':
      default:
        return <Music className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (onAddToPlaylist) {
      onAddToPlaylist(item);
      toast({
        title: "Added to playlist",
        description: `${item.title} has been added to your playlist.`,
      });
    }
  };

  const openExternalLink = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    window.open(`https://www.youtube.com/watch?v=${item.youtubeId}`, '_blank');
  };

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
        {results.map((item) => (
          <div 
            key={item.id}
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer",
              currentlyPlaying === item.id && "bg-primary/20"
            )}
            onClick={() => item.type === 'track' ? onPlay(item.id) : null}
          >
            <div className="flex-shrink-0 mr-3 relative">
              <img 
                src={item.albumArt} 
                alt={item.title}
                className="w-12 h-12 object-cover rounded" 
              />
              <span className="absolute top-0 right-0 bg-black/70 p-0.5 rounded text-xs">
                {getTypeIcon(item.type)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.title}</h4>
              <p className="text-sm text-gray-400 truncate">{item.artist}</p>
              <div className="text-xs text-gray-500">
                {item.type === 'track' ? item.duration : item.type}
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              {item.type === 'track' && (
                <>
                  <button 
                    onClick={(e) => handleAddToPlaylist(e, item)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    title="Add to playlist"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => openExternalLink(e, item)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    title="Open in YouTube"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
