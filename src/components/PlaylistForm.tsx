
import React, { useState, useEffect } from 'react';
import { ListMusic, Image, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PlaylistData } from './Playlist';

interface PlaylistFormProps {
  onSubmit: (playlist: Partial<PlaylistData>) => void;
  onCancel: () => void;
  existingPlaylist?: PlaylistData;
  className?: string;
}

const PlaylistForm = ({
  onSubmit,
  onCancel,
  existingPlaylist,
  className
}: PlaylistFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (existingPlaylist) {
      setName(existingPlaylist.name);
      setDescription(existingPlaylist.description || '');
      setCoverImage(existingPlaylist.coverImage || '');
    }
  }, [existingPlaylist]);

  const validate = () => {
    const newErrors = {
      name: '',
      description: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Playlist name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const playlistData: Partial<PlaylistData> = {
      name,
      description,
      coverImage: coverImage || 'https://picsum.photos/seed/playlist/300/300',
    };
    
    if (existingPlaylist) {
      playlistData.id = existingPlaylist.id;
    } else {
      playlistData.tracks = [];
      playlistData.createdAt = new Date();
    }
    
    onSubmit(playlistData);
  };

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    // For this demo, we'll use a random placeholder image
    const randomId = Math.floor(Math.random() * 1000);
    setCoverImage(`https://picsum.photos/seed/playlist${randomId}/300/300`);
    toast({
      description: "Image uploaded successfully",
    });
  };

  return (
    <div className={cn("bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {existingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-1/3">
            <div
              className="aspect-square bg-black/50 border border-white/10 rounded-md flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors relative overflow-hidden"
              onClick={handleImageUpload}
            >
              {coverImage ? (
                <div className="w-full h-full">
                  <img
                    src={coverImage}
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Image className="h-8 w-8" />
                  </div>
                </div>
              ) : (
                <>
                  <ListMusic className="h-16 w-16 text-gray-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 text-center text-sm">
                    Choose image
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Playlist Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Playlist"
                className={cn(
                  "w-full bg-white/5 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.name ? "border-red-500" : "border-white/10"
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description"
                rows={3}
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.description ? "border-red-500" : "border-white/10"
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {existingPlaylist ? 'Save Changes' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;
