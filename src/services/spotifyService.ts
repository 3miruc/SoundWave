// Using the Spotify API client ID: e6cf501fb09b4b3783545232ca6e696d

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
  // Check if we have a valid token
  if (tokenData && tokenData.expiry_time > Date.now()) {
    return tokenData.access_token;
  }
  
  // Otherwise, get a new token
  try {
    const clientId = 'e6cf501fb09b4b3783545232ca6e696d';
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}`,
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Spotify token');
    }
    
    const data = await response.json();
    
    // Store token with expiry time
    tokenData = {
      ...data,
      expiry_time: Date.now() + (data.expires_in * 1000 * 0.9), // 90% of actual expiry time as safety margin
    };
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return '';
  }
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

// Get global top tracks
export const getTopTracks = async (limit = 20, offset = 0): Promise<any[]> => {
  try {
    const data = await fetchFromSpotify('/playlists/37i9dQZEVXbMDoHDwVN2tF'); // Global Top 50 playlist
    
    return data.tracks.items
      .slice(offset, offset + limit)
      .map((item: any) => {
        const track = item.track;
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(', '),
          albumArt: track.album.images[0]?.url || '',
          duration: formatDuration(track.duration_ms),
          audioUrl: track.preview_url
        };
      });
  } catch (error) {
    console.error('Error getting top tracks:', error);
    return [];
  }
};

// Get new releases
export const getNewReleases = async (limit = 20, offset = 0): Promise<any[]> => {
  try {
    const data = await fetchFromSpotify(`/browse/new-releases?limit=${limit}&offset=${offset}`);
    
    return data.albums.items.map((album: any) => {
      return {
        id: album.id,
        title: album.name,
        artist: album.artists.map((artist: any) => artist.name).join(', '),
        albumArt: album.images[0]?.url || '',
        duration: '', // Not available in this endpoint
        audioUrl: null // Preview URLs not available in this endpoint
      };
    });
  } catch (error) {
    console.error('Error getting new releases:', error);
    return [];
  }
};

// Get country-specific charts
export const getCountryChart = async (countryCode = 'US', limit = 20): Promise<any[]> => {
  try {
    // We're using featured playlists for the country as a proxy for charts
    const data = await fetchFromSpotify(`/browse/featured-playlists?country=${countryCode}&limit=${limit}`);
    
    // Get the first playlist
    if (data.playlists.items.length > 0) {
      const playlistId = data.playlists.items[0].id;
      const playlistData = await fetchFromSpotify(`/playlists/${playlistId}`);
      
      return playlistData.tracks.items
        .slice(0, limit)
        .map((item: any) => {
          const track = item.track;
          return {
            id: track.id,
            title: track.name,
            artist: track.artists.map((artist: any) => artist.name).join(', '),
            albumArt: track.album.images[0]?.url || '',
            duration: formatDuration(track.duration_ms),
            audioUrl: track.preview_url
          };
        });
    }
    
    return [];
  } catch (error) {
    console.error('Error getting country chart:', error);
    return [];
  }
};

// Get track details
export const getTrackDetails = async (trackId: string): Promise<any> => {
  try {
    const data = await fetchFromSpotify(`/tracks/${trackId}`);
    
    return {
      id: data.id,
      title: data.name,
      artist: data.artists.map((artist: any) => artist.name).join(', '),
      albumArt: data.album.images[0]?.url || '',
      albumName: data.album.name,
      duration: formatDuration(data.duration_ms),
      audioUrl: data.preview_url,
      popularity: data.popularity
    };
  } catch (error) {
    console.error('Error getting track details:', error);
    return null;
  }
};

// Search tracks
export const searchTracks = async (query: string, limit = 20): Promise<any[]> => {
  try {
    const data = await fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
    
    return data.tracks.items.map((track: any) => {
      return {
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        albumArt: track.album.images[0]?.url || '',
        duration: formatDuration(track.duration_ms),
        audioUrl: track.preview_url
      };
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

// Helper function to format track duration
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Mock data for fallback when API fails
export const getMockTracks = (): any[] => {
  return [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:20',
      audioUrl: 'https://p.scdn.co/mp3-preview/31f65c6be5a4c0f69b99fcee5a5b98f13fffee9f?cid=e6cf501fb09b4b3783545232ca6e696d'
    },
    {
      id: '2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:54',
      audioUrl: null
    },
    {
      id: '3',
      title: 'Dance Monkey',
      artist: 'Tones and I',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:29',
      audioUrl: null
    },
    {
      id: '4',
      title: 'Someone You Loved',
      artist: 'Lewis Capaldi',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:02',
      audioUrl: null
    },
    {
      id: '5',
      title: 'Don\'t Start Now',
      artist: 'Dua Lipa',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:03',
      audioUrl: null
    },
    {
      id: '6',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      albumArt: 'https://via.placeholder.com/300',
      duration: '2:54',
      audioUrl: null
    },
    {
      id: '7',
      title: 'Bad Guy',
      artist: 'Billie Eilish',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:14',
      audioUrl: null
    },
    {
      id: '8',
      title: 'Circles',
      artist: 'Post Malone',
      albumArt: 'https://via.placeholder.com/300',
      duration: '3:35',
      audioUrl: null
    }
  ];
};
