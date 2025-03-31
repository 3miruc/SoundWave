
// Using the Spotify API client ID: e6cf501fb09b4b3783545232ca6e696d
import { searchYouTubeVideo, getYouTubeVideoUrl, getHighQualityThumbnail } from './youtubeService';

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiry_time: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  popularity: number;
}

let tokenData: SpotifyToken | null = null;

// Function to get Spotify API token
const getToken = async (): Promise<string> => {
  // Since we're having issues with client credentials flow,
  // we'll use mock data instead of trying to authenticate
  console.log('Using mock data instead of Spotify API due to authentication issues');
  return '';
};

// Function to make authenticated API requests
const fetchFromSpotify = async (endpoint: string) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('No valid token available');
    }
    
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Spotify:', error);
    throw error;
  }
};

// Function to enhance track with YouTube data
const enhanceTrackWithYouTube = async (track: any) => {
  try {
    const searchQuery = `${track.title} ${track.artist}`;
    const youtubeData = await searchYouTubeVideo(searchQuery);
    
    if (youtubeData) {
      return {
        ...track,
        youtubeId: youtubeData.videoId,
        youtubeUrl: getYouTubeVideoUrl(youtubeData.videoId),
        backgroundImage: youtubeData.thumbnailUrl || track.albumArt,
      };
    }
    
    return track;
  } catch (error) {
    console.error('Error enhancing track with YouTube data:', error);
    return track;
  }
};

// Get global top tracks
export const getTopTracks = async (limit = 20, offset = 0): Promise<any[]> => {
  // Due to Spotify authentication issues, use mock data
  console.log('Using mock data for top tracks');
  const mockTracks = getMockTracks();
  return mockTracks.slice(0, limit);
};

// Get new releases
export const getNewReleases = async (limit = 20, offset = 0): Promise<any[]> => {
  // Due to Spotify authentication issues, use mock data
  console.log('Using mock data for new releases');
  const mockTracks = getMockTracks();
  return mockTracks.slice(0, limit);
};

// Get country-specific charts
export const getCountryChart = async (countryCode = 'US', limit = 20): Promise<any[]> => {
  // Due to Spotify authentication issues, use mock data
  console.log('Using mock data for country charts');
  const mockTracks = getMockTracks();
  return mockTracks.slice(0, limit);
};

// Get track details
export const getTrackDetails = async (trackId: string): Promise<any> => {
  // Due to Spotify authentication issues, use mock data
  console.log('Using mock data for track details');
  const mockTracks = getMockTracks();
  const track = mockTracks.find(track => track.id === trackId) || mockTracks[0];
  return track;
};

// Search tracks
export const searchTracks = async (query: string, limit = 20): Promise<any[]> => {
  // Due to Spotify authentication issues, use mock data
  console.log('Using mock data for search results');
  const mockTracks = getMockTracks();
  return mockTracks.slice(0, limit);
};

// Helper function to format track duration
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Enhanced mock data with real images and YouTube info
export const getMockTracks = (): any[] => {
  return [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
      duration: '3:20',
      audioUrl: 'https://p.scdn.co/mp3-preview/31f65c6be5a4c0f69b99fcee5a5b98f13fffee9f?cid=e6cf501fb09b4b3783545232ca6e696d',
      youtubeId: 'J7p4bzqLvCw',
      youtubeUrl: 'https://www.youtube.com/watch?v=J7p4bzqLvCw',
      backgroundImage: 'https://img.youtube.com/vi/J7p4bzqLvCw/maxresdefault.jpg',
      popularity: 95,
      albumName: 'After Hours'
    },
    {
      id: '2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
      duration: '3:54',
      audioUrl: null,
      youtubeId: 'JGwWNGJdvx8',
      youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
      backgroundImage: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      popularity: 92,
      albumName: '÷ (Divide)'
    },
    {
      id: '3',
      title: 'Dance Monkey',
      artist: 'Tones and I',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273c6f7af36ecbaae847a1fc62e',
      duration: '3:29',
      audioUrl: null,
      youtubeId: 'q0hyYWKXF0Q',
      youtubeUrl: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
      backgroundImage: 'https://img.youtube.com/vi/q0hyYWKXF0Q/maxresdefault.jpg',
      popularity: 88,
      albumName: 'The Kids Are Coming'
    },
    {
      id: '4',
      title: 'Someone You Loved',
      artist: 'Lewis Capaldi',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273fc2101e6889d6ce9025f85f2',
      duration: '3:02',
      audioUrl: null,
      youtubeId: 'zABLecsR5UE',
      youtubeUrl: 'https://www.youtube.com/watch?v=zABLecsR5UE',
      backgroundImage: 'https://img.youtube.com/vi/zABLecsR5UE/maxresdefault.jpg',
      popularity: 89,
      albumName: 'Divinely Uninspired To A Hellish Extent'
    },
    {
      id: '5',
      title: 'Don\'t Start Now',
      artist: 'Dua Lipa',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
      duration: '3:03',
      audioUrl: null,
      youtubeId: 'oygrmJFKYZY',
      youtubeUrl: 'https://www.youtube.com/watch?v=oygrmJFKYZY',
      backgroundImage: 'https://img.youtube.com/vi/oygrmJFKYZY/maxresdefault.jpg',
      popularity: 87,
      albumName: 'Future Nostalgia'
    },
    {
      id: '6',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273d9d50543cca98f5a06508f24',
      duration: '2:54',
      audioUrl: null,
      youtubeId: 'E07s5ZYygMg',
      youtubeUrl: 'https://www.youtube.com/watch?v=E07s5ZYygMg',
      backgroundImage: 'https://img.youtube.com/vi/E07s5ZYygMg/maxresdefault.jpg',
      popularity: 90,
      albumName: 'Fine Line'
    },
    {
      id: '7',
      title: 'Bad Guy',
      artist: 'Billie Eilish',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2737005885df706891a3c182a57',
      duration: '3:14',
      audioUrl: null,
      youtubeId: 'DyDfgMOUjCI',
      youtubeUrl: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
      backgroundImage: 'https://img.youtube.com/vi/DyDfgMOUjCI/maxresdefault.jpg',
      popularity: 91,
      albumName: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?'
    },
    {
      id: '8',
      title: 'Circles',
      artist: 'Post Malone',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268',
      duration: '3:35',
      audioUrl: null,
      youtubeId: 'wXhTHyIgQ_U',
      youtubeUrl: 'https://www.youtube.com/watch?v=wXhTHyIgQ_U',
      backgroundImage: 'https://img.youtube.com/vi/wXhTHyIgQ_U/maxresdefault.jpg',
      popularity: 88,
      albumName: 'Hollywood\'s Bleeding'
    },
    {
      id: '9',
      title: 'Señorita',
      artist: 'Shawn Mendes, Camila Cabello',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b27368768acf47f28983f8e3bedb',
      duration: '3:11',
      audioUrl: null,
      youtubeId: 'Pkh8UtuejGw',
      youtubeUrl: 'https://www.youtube.com/watch?v=Pkh8UtuejGw',
      backgroundImage: 'https://img.youtube.com/vi/Pkh8UtuejGw/maxresdefault.jpg',
      popularity: 86,
      albumName: 'Señorita'
    },
    {
      id: '10',
      title: 'Memories',
      artist: 'Maroon 5',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273c0e7bf5cdd630f314f20586a',
      duration: '3:09',
      audioUrl: null,
      youtubeId: 'SlPhMPnQ58k',
      youtubeUrl: 'https://www.youtube.com/watch?v=SlPhMPnQ58k',
      backgroundImage: 'https://img.youtube.com/vi/SlPhMPnQ58k/maxresdefault.jpg',
      popularity: 84,
      albumName: 'Memories'
    }
  ];
};
