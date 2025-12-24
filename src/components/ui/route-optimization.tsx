import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCalculateRouteMutation, useGetRouteQuery } from '@/redux/features/location/location-api';
import { MAPBOX_CONFIG, ROUTE_CONFIG } from '@/config/mapbox-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Route, Navigation, Clock, MapPin, Zap, Car, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouteOptimizationProps {
  rideId: string;
  pickupLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  onRouteCalculated?: (route: RouteData) => void;
  className?: string;
  showMap?: boolean;
  autoCalculate?: boolean;
}

interface RouteData {
  rideId: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  duration: number;
  distance: number;
  instructions?: Array<{
    text: string;
    distance: number;
    duration: number;
    type: string;
  }>;
  waypoints: Array<{
    lat: number;
    lng: number;
    name?: string;
  }>;
}

interface RouteOption {
  profile: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const routeOptions: RouteOption[] = [
  {
    profile: 'driving-traffic',
    label: 'Fastest (Traffic)',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-orange-600'
  },
  {
    profile: 'driving',
    label: 'Driving',
    icon: <Car className="h-4 w-4" />,
    color: 'text-blue-600'
  },
  {
    profile: 'cycling',
    label: 'Cycling',
    icon: <Navigation className="h-4 w-4" />,
    color: 'text-green-600'
  },
  {
    profile: 'walking',
    label: 'Walking',
    icon: <Footprints className="h-4 w-4" />,
    color: 'text-purple-600'
  }
];

const RouteOptimization: React.FC<RouteOptimizationProps> = ({
  rideId,
  pickupLocation,
  destination,
  onRouteCalculated,
  className,
  showMap = false,
  autoCalculate = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const routeLayerRef = useRef<string | null>(null);

  const [selectedProfile, setSelectedProfile] = useState<'driving' | 'driving-traffic' | 'walking' | 'cycling'>('driving-traffic');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [calculateRoute, { isLoading: isCalculatingRoute }] = useCalculateRouteMutation();
  const { data: storedRouteData, isLoading: isLoadingStoredRoute } = useGetRouteQuery(rideId, {
    skip: !rideId
  });

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!showMap || !mapRef.current || mapInstanceRef.current) return;

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
  }, [showMap]);

  const initializeMapInstance = useCallback(() => {
    if (!window.mapboxgl || !mapRef.current) return;

    // Set access token globally
    (window as any).mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: MAPBOX_CONFIG.style,
      center: [(pickupLocation.lng + destination.lng) / 2, (pickupLocation.lat + destination.lat) / 2],
      zoom: 12,
    });

    map.on('load', () => {
      mapInstanceRef.current = map;

      // Add navigation controls
      map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

      // Add markers for pickup and destination
      addRouteMarkers(map);
    });

    map.on('error', (e) => {
      console.error('Map error:', e);
    });
  }, [pickupLocation, destination]);

  // Add markers to map
  const addRouteMarkers = useCallback((map: mapboxgl.Map) => {
    // Pickup marker
    const pickupEl = document.createElement('div');
    pickupEl.className = 'pickup-marker';
    pickupEl.style.width = '32px';
    pickupEl.style.height = '32px';
    pickupEl.style.backgroundColor = '#10b981';
    pickupEl.style.borderRadius = '50%';
    pickupEl.style.border = '3px solid white';
    pickupEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    pickupEl.style.display = 'flex';
    pickupEl.style.alignItems = 'center';
    pickupEl.style.justifyContent = 'center';
    pickupEl.style.color = 'white';
    pickupEl.style.fontSize = '12px';
    pickupEl.style.fontWeight = 'bold';
    pickupEl.innerHTML = 'P';

    new window.mapboxgl.Marker(pickupEl)
      .setLngLat([pickupLocation.lng, pickupLocation.lat])
      .addTo(map);

    // Destination marker
    const destEl = document.createElement('div');
    destEl.className = 'destination-marker';
    destEl.style.width = '32px';
    destEl.style.height = '32px';
    destEl.style.backgroundColor = '#ef4444';
    destEl.style.borderRadius = '50%';
    destEl.style.border = '3px solid white';
    destEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    destEl.style.display = 'flex';
    destEl.style.alignItems = 'center';
    destEl.style.justifyContent = 'center';
    destEl.style.color = 'white';
    destEl.style.fontSize = '12px';
    destEl.style.fontWeight = 'bold';
    destEl.innerHTML = 'D';

    new window.mapboxgl.Marker(destEl)
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);
  }, [pickupLocation, destination]);

  // Display route on map
  const displayRouteOnMap = useCallback((route: RouteData) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing route layer
    if (routeLayerRef.current) {
      if (map.getLayer(routeLayerRef.current)) {
        map.removeLayer(routeLayerRef.current);
      }
      if (map.getSource(routeLayerRef.current)) {
        map.removeSource(routeLayerRef.current);
      }
    }

    // Add new route layer
    const routeId = `route-${Date.now()}`;
    routeLayerRef.current = routeId;

    map.addSource(routeId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.geometry.coordinates
        }
      }
    });

    map.addLayer({
      id: routeId,
      type: 'line',
      source: routeId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': ROUTE_CONFIG.default.color,
        'line-width': ROUTE_CONFIG.default.width,
        'line-opacity': ROUTE_CONFIG.default.opacity
      }
    });

    // Fit map to route bounds
    const bounds = new window.mapboxgl.LngLatBounds();
    route.geometry.coordinates.forEach((coord: number[]) => {
      bounds.extend([coord[0], coord[1]]);
    });
    map.fitBounds(bounds, { padding: 50 });
  }, []);

  // Calculate route
  const handleCalculateRoute = useCallback(async (profile?: string) => {
    const routeProfile = profile || selectedProfile;
    setIsCalculating(true);

    try {
      const result = await calculateRoute({
        rideId,
        profile: routeProfile,
        alternatives: false,
        steps: true
      }).unwrap();

      if (result.data) {
        const route = result.data;
        setRouteData(route);

        if (showMap) {
          displayRouteOnMap(route);
        }

        onRouteCalculated?.(route);
      }
    } catch (error) {
      console.error('Failed to calculate route:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [rideId, selectedProfile, calculateRoute, showMap, displayRouteOnMap, onRouteCalculated]);

  // Handle profile change
  const handleProfileChange = useCallback((profile: string) => {
    setSelectedProfile(profile as typeof selectedProfile);
    handleCalculateRoute(profile);
  }, [handleCalculateRoute]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  // Initialize map on mount
  useEffect(() => {
    if (showMap) {
      initializeMap();
    }

    return () => {
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, initializeMap]);

  // Auto-calculate route on mount
  useEffect(() => {
    if (autoCalculate && rideId && pickupLocation && destination) {
      handleCalculateRoute();
    }
  }, [autoCalculate, rideId, pickupLocation, destination]);

  // Load stored route if available
  useEffect(() => {
    if (storedRouteData?.data && !routeData) {
      setRouteData(storedRouteData.data);
      if (showMap) {
        displayRouteOnMap(storedRouteData.data);
      }
    }
  }, [storedRouteData, routeData, showMap, displayRouteOnMap]);



  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Route Optimization
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route Profile Selection */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Route Type:</label>
          <Select value={selectedProfile} onValueChange={handleProfileChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {routeOptions.map((option) => (
                <SelectItem key={option.profile} value={option.profile}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className={option.color}>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleCalculateRoute()}
            disabled={isCalculating || isCalculatingRoute}
            size="sm"
          >
            {isCalculating || isCalculatingRoute ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Recalculate
          </Button>
        </div>

        {/* Route Information */}
        {routeData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">
                {formatDuration(routeData.duration)}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Route className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">
                {formatDistance(routeData.distance)}
              </div>
              <div className="text-sm text-muted-foreground">Distance</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">
                {routeData.instructions?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Steps</div>
            </div>
          </div>
        )}

        {/* Route Instructions */}
        {routeData?.instructions && routeData.instructions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Turn-by-Turn Directions</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {routeData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3 p-2 bg-muted rounded text-sm">
                  <Badge variant="outline" className="flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{instruction.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistance(instruction.distance)} • {formatDuration(instruction.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Container */}
        {showMap && (
          <div
            ref={mapRef}
            className="w-full h-64 bg-muted rounded-lg overflow-hidden"
            style={{ minHeight: '256px' }}
          />
        )}

        {/* Loading State */}
        {(isCalculating || isCalculatingRoute || isLoadingStoredRoute) && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {isLoadingStoredRoute ? 'Loading route...' : 'Calculating optimal route...'}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!routeData && !isCalculating && !isCalculatingRoute && !isLoadingStoredRoute && (
          <div className="text-center py-8">
            <Route className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No route calculated yet
            </p>
            <Button onClick={() => handleCalculateRoute()}>
              Calculate Route
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteOptimization;