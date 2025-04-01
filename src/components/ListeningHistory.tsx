
import React from 'react';
import { Clock, Play, Trash2, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  listenedAt: Date;
}

interface ListeningHistoryProps {
  history: HistoryItem[];
  onPlay: (id: string) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  className?: string;
}

const ListeningHistory = ({
  history,
  onPlay,
  onClearHistory,
  onRemoveItem,
  className
}: ListeningHistoryProps) => {
  
  if (history.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Clock className="h-12 w-12 mx-auto text-gray-500 mb-3" />
        <h3 className="text-xl font-medium mb-2">No listening history yet</h3>
        <p className="text-gray-500">Start playing some tracks to build your history</p>
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toast({
      title: "Added to favorites",
      description: "Track has been added to your favorites."
    });
  };

  return (
    <div className={cn("bg-card/30 backdrop-blur-md rounded-lg p-4 border border-white/5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Listening History</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="text-sm text-gray-400 hover:text-white flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => onPlay(item.id)}
          >
            <img
              src={item.albumArt}
              alt={item.title}
              className="w-12 h-12 object-cover rounded mr-3"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.title}</h4>
              <p className="text-sm text-gray-400 truncate">{item.artist}</p>
            </div>
            <div className="text-xs text-gray-500 mr-4">
              {formatTimeAgo(item.listenedAt)}
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item.id);
                }}
                className="p-1.5 rounded-full hover:bg-primary/20 transition-colors text-gray-400 hover:text-primary"
                title="Play"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => handleFavorite(e, item.id)}
                className="p-1.5 rounded-full hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-500"
                title="Add to favorites"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                title="Remove from history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningHistory;
