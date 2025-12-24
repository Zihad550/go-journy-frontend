import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket';
import { useGetDriverLocationQuery, useGetLocationHistoryQuery } from '@/redux/features/location/location-api';
import { MAPBOX_CONFIG, MARKER_CONFIG } from '@/config/mapbox-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Clock, Navigation, Play, Pause, RotateCcw, SkipBack, SkipForward, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveTrackingProps {
  rideId?: string;
  driverId?: string;
  className?: string;
}

interface DriverMarker {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}



interface PlaybackState {
  isPlaying: boolean;
  currentIndex: number;
  speed: number;
  startTime: string;
  endTime: string;
  isHistoryMode: boolean;
}

interface TimelineProps {
  locations: Array<{
    lat: number;
    lng: number;
    timestamp?: string;
    speed?: number;
    heading?: number;
  }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  startTime: string;
  endTime: string;
}

// Timeline Scrubbing Component
const Timeline: React.FC<TimelineProps> = ({
  locations,
  currentIndex,
  onIndexChange,
  startTime,
  endTime
}) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '--:--:--';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.value);
    onIndexChange(index);
  };

  if (!locations.length) return null;

  const currentLocation = locations[currentIndex];
  const progress = locations.length > 1 ? (currentIndex / (locations.length - 1)) * 100 : 0;

  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {startTime ? formatTime(startTime) : 'Start'}
        </span>
        <span className="font-medium">
          {currentLocation ? formatTime(currentLocation.timestamp) : '--:--:--'}
        </span>
        <span className="text-muted-foreground">
          {endTime ? formatTime(endTime) : 'End'}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min="0"
          max={locations.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{currentIndex + 1} of {locations.length} locations</span>
        {currentLocation && (
          <div className="flex items-center gap-2">
            <span>Speed: {currentLocation.speed ? `${Math.round(currentLocation.speed * 3.6)} km/h` : '--'}</span>
            <span>Heading: {currentLocation.heading ? `${Math.round(currentLocation.heading)}°` : '--'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveTracking: React.FC<LiveTrackingProps> = ({
  rideId,
  driverId,
  className
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  const [driverMarker, setDriverMarker] = useState<DriverMarker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentIndex: 0,
    speed: 1,
    startTime: '',
    endTime: '',
    isHistoryMode: false
  });

  // WebSocket hooks
  const {
    connect,
    disconnect,
    isConnected,
    joinRide,
    leaveRide,
    trackDriver,
    stopTrackingDriver,
    onLocationUpdate,
    onRideStatusUpdate,
    onETAUpdate,
    onError
  } = useWebSocket();

  // Get driver ID from props
  const currentDriverId = driverId || '';

  // API hooks
  const { data: driverLocationData, isLoading: isLoadingDriverLocation } = useGetDriverLocationQuery(
    currentDriverId || '',
    {
      skip: !currentDriverId,
      pollingInterval: 30000, // Poll every 30 seconds as backup
    }
  );

  const { data: locationHistoryData } = useGetLocationHistoryQuery(
    {
      rideId: rideId || '',
      startTime: playbackState.startTime,
      endTime: playbackState.endTime,
      limit: 1000
    },
    {
      skip: !rideId || !playbackState.startTime,
    }
  );

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Load Mapbox GL JS dynamically if not loaded
      if (!window.mapboxgl) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.onload = () => initializeMapInstance();
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      } else {
        initializeMapInstance();
      }
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }, []);

  const initializeMapInstance = useCallback(() => {
    if (!window.mapboxgl || !mapRef.current) return;

    // Set access token globally
    (window as any).mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: MAPBOX_CONFIG.style,
      center: [MAPBOX_CONFIG.center.lng, MAPBOX_CONFIG.center.lat],
      zoom: MAPBOX_CONFIG.zoom.default,
    });

    map.on('load', () => {
      setIsMapLoaded(true);
      mapInstanceRef.current = map;

      // Add navigation controls
      map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');

      // Fit bounds if we have driver location
      if (driverMarker) {
        map.setCenter([driverMarker.lng, driverMarker.lat]);
        map.setZoom(15);
      }
    });

    map.on('error', (e) => {
      console.error('Map error:', e);
    });
  }, [driverMarker]);

  // Update driver marker on map
  const updateDriverMarker = useCallback((location: DriverMarker) => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    const map = mapInstanceRef.current;

    // Remove existing driver marker
    const existingMarker = markersRef.current.get('driver');
    if (existingMarker) {
      existingMarker.remove();
    }

    // Create new driver marker
    const el = document.createElement('div');
    el.className = 'driver-marker';
    el.style.width = `${MARKER_CONFIG.driver.size}px`;
    el.style.height = `${MARKER_CONFIG.driver.size}px`;
    el.style.backgroundColor = MARKER_CONFIG.driver.color;
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = 'white';
    el.style.fontSize = '12px';
    el.style.fontWeight = 'bold';
    el.innerHTML = '🚗';

    const marker = new window.mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    markersRef.current.set('driver', marker);

    // Update map center if driver is moving
    if (driverMarker && (
      Math.abs(driverMarker.lat - location.lat) > 0.001 ||
      Math.abs(driverMarker.lng - location.lng) > 0.001
    )) {
      map.easeTo({
        center: [location.lng, location.lat],
        duration: 1000,
      });
    }
  }, [driverMarker, isMapLoaded]);

  // WebSocket event handlers
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeLocationUpdate = onLocationUpdate((data) => {
      if (data.driverId === driverId) {
        const newLocation: DriverMarker = {
          id: data.driverId,
          lat: data.location.lat,
          lng: data.location.lng,
          heading: data.location.heading,
          speed: data.location.speed,
          timestamp: data.location.timestamp,
        };

        setDriverMarker(newLocation);
        updateDriverMarker(newLocation);
      }
    });

    const unsubscribeRideStatusUpdate = onRideStatusUpdate((data) => {
      if (data.rideId === rideId) {
        console.log('Ride status update:', data);
        // Handle ride status changes
      }
    });

    const unsubscribeETAUpdate = onETAUpdate((data) => {
      if (data.rideId === rideId) {
        console.log('ETA update:', data);
        // Handle ETA updates
      }
    });

    const unsubscribeError = onError((error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      unsubscribeLocationUpdate();
      unsubscribeRideStatusUpdate();
      unsubscribeETAUpdate();
      unsubscribeError();
    };
  }, [isConnected, driverId, rideId, onLocationUpdate, onRideStatusUpdate, onETAUpdate, onError, updateDriverMarker]);

  // Connect to WebSocket and join rooms
  useEffect(() => {
    connect();

    if (rideId) {
      joinRide(rideId);
    }

    if (driverId) {
      trackDriver(driverId);
    }

    return () => {
      if (rideId) leaveRide();
      if (driverId) stopTrackingDriver();
      disconnect();
    };
  }, [connect, disconnect, joinRide, leaveRide, trackDriver, stopTrackingDriver, rideId, driverId]);

  // Initialize map on mount
  useEffect(() => {
    initializeMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();

      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  // Update driver marker when location data changes
  useEffect(() => {
    if (driverLocationData?.data && !driverMarker) {
      const location: DriverMarker = {
        id: driverLocationData.data.driverId,
        lat: driverLocationData.data.location.lat,
        lng: driverLocationData.data.location.lng,
        timestamp: driverLocationData.data.lastUpdated,
      };
      setDriverMarker(location);
      updateDriverMarker(location);
    }
  }, [driverLocationData, driverMarker, updateDriverMarker]);

  // Playback animation logic
  useEffect(() => {
    if (!playbackState.isPlaying || !playbackState.isHistoryMode || !locationHistoryData?.data?.locations) {
      return;
    }

    const locations = locationHistoryData.data.locations;
    const interval = setInterval(() => {
      setPlaybackState(prev => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= locations.length) {
          // Loop back to start or stop
          return {
            ...prev,
            currentIndex: 0,
            isPlaying: false
          };
        }
        return {
          ...prev,
          currentIndex: nextIndex
        };
      });
    }, 1000 / playbackState.speed); // Adjust speed

    return () => clearInterval(interval);
  }, [playbackState.isPlaying, playbackState.isHistoryMode, playbackState.speed, locationHistoryData]);

  // Update map marker during playback
  useEffect(() => {
    if (!playbackState.isHistoryMode || !locationHistoryData?.data?.locations) {
      return;
    }

    const locations = locationHistoryData.data.locations;
    const currentLocation = locations[playbackState.currentIndex];

    if (currentLocation) {
      const location: DriverMarker = {
        id: currentDriverId || 'unknown',
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        heading: currentLocation.heading,
        speed: currentLocation.speed,
        timestamp: currentLocation.timestamp || new Date().toISOString(),
      };

      setDriverMarker(location);
      updateDriverMarker(location);
    }
  }, [playbackState.currentIndex, playbackState.isHistoryMode, locationHistoryData, driverId, updateDriverMarker]);

  // Playback controls for location history
  const togglePlayback = () => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const resetPlayback = () => {
    setPlaybackState(prev => ({
      ...prev,
      currentIndex: 0,
      isPlaying: false
    }));
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackState(prev => ({
      ...prev,
      speed
    }));
  };

  const toggleHistoryMode = () => {
    setPlaybackState(prev => ({
      ...prev,
      isHistoryMode: !prev.isHistoryMode,
      isPlaying: false,
      currentIndex: 0
    }));
  };

  const handleTimelineChange = (index: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentIndex: index,
      isPlaying: false
    }));
  };

  const skipToStart = () => {
    setPlaybackState(prev => ({
      ...prev,
      currentIndex: 0,
      isPlaying: false
    }));
  };

  const skipToEnd = () => {
    const locations = locationHistoryData?.data?.locations;
    if (locations && locations.length > 0) {
      setPlaybackState(prev => ({
        ...prev,
        currentIndex: locations.length - 1,
        isPlaying: false
      }));
    }
  };

  // Error state for missing parameters
  if (!rideId && !driverId) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No ride or driver specified</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please provide a ride ID or driver ID to track location.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state for API failures
  if (locationHistoryData && 'error' in locationHistoryData) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Live Tracking - Error
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Failed to load location history</p>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to retrieve historical location data. This might be due to network issues or server problems.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }



  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Live Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected() ? "default" : "destructive"}>
              {isConnected() ? "Connected" : "Disconnected"}
            </Badge>
            {isLoadingDriverLocation && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-96 bg-muted rounded-lg overflow-hidden"
          style={{ minHeight: '400px' }}
        />

        {/* Status Information */}
        {driverMarker && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {driverMarker.speed ? `${Math.round(driverMarker.speed * 3.6)} km/h` : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {driverMarker.heading ? `${Math.round(driverMarker.heading)}°` : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Heading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {driverMarker.lat.toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">Latitude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {driverMarker.lng.toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">Longitude</div>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        {locationHistoryData?.data?.locations && locationHistoryData.data.locations.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-2">
            <Button
              variant={playbackState.isHistoryMode ? "default" : "outline"}
              size="sm"
              onClick={toggleHistoryMode}
            >
              {playbackState.isHistoryMode ? "History Mode" : "Live Mode"}
            </Button>
          </div>
        )}

        {/* Playback Controls */}
        {locationHistoryData?.data?.locations && locationHistoryData.data.locations.length > 0 && playbackState.isHistoryMode && (
          <div className="space-y-4">
            {/* Timeline */}
            <Timeline
              locations={locationHistoryData.data.locations.filter(loc => loc.timestamp)}
              currentIndex={playbackState.currentIndex}
              onIndexChange={handleTimelineChange}
              startTime={locationHistoryData.data.timeRange?.start || ''}
              endTime={locationHistoryData.data.timeRange?.end || ''}
            />

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={skipToStart}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={resetPlayback}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
              >
                {playbackState.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={skipToEnd}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant={playbackState.speed === 0.5 ? "default" : "outline"}
                  size="sm"
                  onClick={() => changePlaybackSpeed(0.5)}
                >
                  0.5x
                </Button>
                <Button
                  variant={playbackState.speed === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => changePlaybackSpeed(1)}
                >
                  1x
                </Button>
                <Button
                  variant={playbackState.speed === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => changePlaybackSpeed(2)}
                >
                  2x
                </Button>
              </div>

              <div className="text-sm text-muted-foreground ml-4">
                {locationHistoryData.data.locations.length} locations
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Connecting to live tracking service...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTracking;