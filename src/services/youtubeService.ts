
// Using the YouTube Data API with key AIzaSyDESFdnFDhHci0l7eMYZy7mPCeQmFuGqic

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

interface YouTubeResponse {
  items: YouTubeSearchResult[];
}

// Function to search YouTube for a music video
export const searchYouTubeVideo = async (query: string): Promise<{ videoId: string; thumbnailUrl: string } | null> => {
  try {
    const apiKey = 'AIzaSyDESFdnFDhHci0l7eMYZy7mPCeQmFuGqic';
    const searchQuery = `${query} official music video`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`;
    
    console.log('Searching YouTube for:', searchQuery);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data: YouTubeResponse = await response.json();
    console.log('YouTube API response:', data);
    
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const thumbnailUrl = data.items[0].snippet.thumbnails.high.url;
      
      console.log('Found YouTube video:', videoId, thumbnailUrl);
      return { videoId, thumbnailUrl };
    }
    
    console.log('No YouTube videos found for query:', query);
    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
};

// Function to get YouTube video URL
export const getYouTubeVideoUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

// Function to get YouTube embed URL
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

// Function to get high quality thumbnail
export const getHighQualityThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Function to get maximum quality thumbnail
export const getMaxQualityThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
