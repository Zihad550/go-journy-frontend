// Mapbox Configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
  style: 'mapbox://styles/mapbox/streets-v12', // Default style
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    navigationDay: 'mapbox://styles/mapbox/navigation-day-v1',
    navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  },
  center: {
    lat: 23.8103, // Dhaka, Bangladesh as default
    lng: 90.4125,
  },
  zoom: {
    default: 13,
    min: 1,
    max: 20,
  },
  // Mapbox API endpoints
  api: {
    directions: 'https://api.mapbox.com/directions/v5',
    geocoding: 'https://api.mapbox.com/geocoding/v5',
    places: 'https://api.mapbox.com/geocoding/v5',
  },
  // WebSocket configuration
  websocket: {
    url: import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000',
    path: '/socket.io',
  },
};

// Mapbox layer configurations
export const MAP_LAYERS = {
  traffic: {
    id: 'traffic',
    type: 'line',
    source: 'mapbox://mapbox.mapbox-traffic-v1',
    'source-layer': 'traffic',
    paint: {
      'line-width': 1.5,
      'line-color': [
        'case',
        ['==', ['get', 'congestion'], 'low'], '#00ff00',
        ['==', ['get', 'congestion'], 'moderate'], '#ffff00',
        ['==', ['get', 'congestion'], 'heavy'], '#ff0000',
        ['==', ['get', 'congestion'], 'severe'], '#8b0000',
        '#000000'
      ]
    }
  }
};

// Marker configurations
export const MARKER_CONFIG = {
  pickup: {
    color: '#10b981', // green
    size: 32,
  },
  destination: {
    color: '#ef4444', // red
    size: 32,
  },
  driver: {
    color: '#3b82f6', // blue
    size: 28,
  },
  poi: {
    color: '#8b5cf6', // purple
    size: 24,
  }
};

// Route configurations
export const ROUTE_CONFIG = {
  default: {
    color: '#6366f1',
    width: 4,
    opacity: 0.8,
  },
  alternative: {
    color: '#94a3b8',
    width: 3,
    opacity: 0.6,
  },
  traffic: {
    color: '#f59e0b',
    width: 4,
    opacity: 0.9,
  }
};

// Animation configurations
export const ANIMATION_CONFIG = {
  marker: {
    duration: 1000,
    easing: 'ease-in-out',
  },
  route: {
    duration: 2000,
    easing: 'ease-in-out',
  },
  zoom: {
    duration: 1500,
    easing: 'ease-out',
  }
};

// Geolocation options
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

// Error messages
export const MAP_ERRORS = {
  NO_TOKEN: 'Mapbox access token is required',
  INVALID_COORDINATES: 'Invalid coordinates provided',
  NETWORK_ERROR: 'Network error occurred',
  PERMISSION_DENIED: 'Location permission denied',
  POSITION_UNAVAILABLE: 'Position unavailable',
  TIMEOUT: 'Location request timed out',
};

// Utility functions
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const calculateDistance = (
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};