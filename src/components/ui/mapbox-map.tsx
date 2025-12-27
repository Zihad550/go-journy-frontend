"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateDistance,
  MAPBOX_CONFIG,
  MARKER_CONFIG,
  ROUTE_CONFIG,
  validateCoordinates,
} from "@/config";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Navigation, Route } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl/mapbox";
import { toast } from "sonner";

// Types
interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: Date;
  address?: string;
}

interface RouteData {
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
}

interface MapboxMapProps {
  pickupLocation?: Location;
  destination?: Location;
  driverLocation?: Location;
  route?: RouteData;
  pois?: Array<{
    id: string;
    name: string;
    type: string;
    coordinates: { lat: number; lng: number };
    address: string;
    distance: number;
    rating?: number;
  }>;
  locationHistory?: Array<{
    lat: number;
    lng: number;
    timestamp?: string;
    speed?: number;
    heading?: number;
  }>;
  className?: string;
  showControls?: boolean;
  showTraffic?: boolean;
  showPOIs?: boolean;
  showLocationHistory?: boolean;
  onLocationSelect?: (location: Location) => void;
  onRouteCalculated?: (route: RouteData) => void;
  onPOISelect?: (poi: any) => void;
  interactive?: boolean;
  height?: string;
}

interface MarkerProps {
  location: Location;
  type: "pickup" | "destination" | "driver" | "poi";
  onClick?: () => void;
}

// Custom Marker Component
function CustomMarker({ location, type, onClick }: MarkerProps) {
  const config = MARKER_CONFIG[type] || MARKER_CONFIG.pickup; // Fallback for POI

  return (
    <Marker latitude={location.lat} longitude={location.lng} onClick={onClick}>
      <div
        className="relative cursor-pointer transform hover:scale-110 transition-transform"
        style={{
          width: config.size,
          height: config.size,
        }}
      >
        {/* Marker Icon */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: config.color }}
        >
          {type === "poi" ? (
            <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">
              📍
            </span>
          ) : (
            <MapPin
              className="w-full h-full p-1 text-white"
              fill="currentColor"
            />
          )}
        </div>

        {/* Pulse Animation for Driver */}
        {type === "driver" && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: config.color }}
          />
        )}

        {/* Accuracy Circle */}
        {location.accuracy && location.accuracy > 0 && (
          <div
            className="absolute border border-current rounded-full opacity-20"
            style={{
              width: location.accuracy * 2,
              height: location.accuracy * 2,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: config.color,
            }}
          />
        )}
      </div>
    </Marker>
  );
}

// Main MapboxMap Component
export function MapboxMap({
  pickupLocation,
  destination,
  driverLocation,
  route,
  pois = [],
  locationHistory = [],
  className,
  showControls = true,
  showTraffic = false,
  showPOIs = true,
  showLocationHistory = true,
  onLocationSelect,
  onRouteCalculated,
  onPOISelect,
  interactive = true,
  height = "h-80",
}: MapboxMapProps) {
  const mapRef = useRef<any>(null);
  const [popup_info, set_popup_info] = useState<{
    location: Location;
    type: string;
  } | null>(null);
  const [is_loading, set_is_loading] = useState(false);

  // Calculate map bounds to fit all markers
  const calculateBounds = useCallback(() => {
    const locations: Location[] = [];

    if (pickupLocation) locations.push(pickupLocation);
    if (destination) locations.push(destination);
    if (driverLocation) locations.push(driverLocation);

    // Add POI locations
    if (showPOIs && pois.length > 0) {
      pois.forEach((poi) => {
        locations.push({
          lat: poi.coordinates.lat,
          lng: poi.coordinates.lng,
          timestamp: new Date(),
        });
      });
    }

    // Add location history points
    if (showLocationHistory && locationHistory.length > 0) {
      locationHistory.forEach((point) => {
        locations.push({
          lat: point.lat,
          lng: point.lng,
          timestamp: point.timestamp ? new Date(point.timestamp) : new Date(),
        });
      });
    }

    if (locations.length === 0) return null;

    const lats = locations.map((loc) => loc.lat);
    const lngs = locations.map((loc) => loc.lng);

    return [
      [Math.min(...lngs), Math.min(...lats)], // Southwest
      [Math.max(...lngs), Math.max(...lats)], // Northeast
    ];
  }, [
    pickupLocation,
    destination,
    driverLocation,
    pois,
    locationHistory,
    showPOIs,
    showLocationHistory,
  ]);

  // Fit map to show all markers
  const fitBounds = useCallback(() => {
    const bounds = calculateBounds();
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    }
  }, [calculateBounds]);

  // Handle map click for location selection
  const handleMapClick = useCallback(
    (event: any) => {
      if (!interactive || !onLocationSelect) return;

      const { lng, lat } = event.lngLat;
      const location: Location = {
        lat,
        lng,
        timestamp: new Date(),
      };

      onLocationSelect(location);
    },
    [interactive, onLocationSelect],
  );

  // Handle marker click
  const handleMarkerClick = useCallback((location: Location, type: string) => {
    set_popup_info({ location, type });
  }, []);

  // Calculate route when pickup and destination are available
  useEffect(() => {
    if (pickupLocation && destination && onRouteCalculated && !route) {
      calculateRoute();
    }
  }, [pickupLocation, destination, onRouteCalculated, route]);

  // Calculate route using Mapbox Directions API
  const calculateRoute = async () => {
    if (!pickupLocation || !destination) return;

    set_is_loading(true);
    try {
      const response = await fetch(
        `${MAPBOX_CONFIG.api.directions}/mapbox/driving/${pickupLocation.lng},${pickupLocation.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_CONFIG.accessToken}`,
      );

      if (!response.ok) throw new Error("Failed to calculate route");

      const data = await response.json();
      const route = data.routes[0];

      if (route && onRouteCalculated) {
        const routeData: RouteData = {
          geometry: route.geometry,
          duration: route.duration,
          distance: route.distance,
          instructions: route.legs[0]?.steps?.map((step: any) => ({
            text: step.maneuver.instruction,
            distance: step.distance,
            duration: step.duration,
            type: step.maneuver.type,
          })),
        };

        onRouteCalculated(routeData);
      }
    } catch {
      toast.error("Failed to calculate route");
    } finally {
      set_is_loading(false);
    }
  };

  // Fit bounds when locations change
  useEffect(() => {
    if (pickupLocation || destination || driverLocation) {
      // Delay to ensure map is ready
      setTimeout(fitBounds, 100);
    }
  }, [pickupLocation, destination, driverLocation, fitBounds]);

  // Validate Mapbox token
  if (
    !MAPBOX_CONFIG.accessToken ||
    MAPBOX_CONFIG.accessToken === "your_mapbox_access_token_here"
  ) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Route className="h-5 w-5 text-primary" />
            </div>
            Map Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <Route className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Mapbox Token Required
              </h3>
              <p className="text-muted-foreground">
                Please add your Mapbox access token to the .env file as
                VITE_MAPBOX_ACCESS_TOKEN
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Route className="h-5 w-5 text-primary" />
          </div>
          Live Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn("relative", height)}>
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_CONFIG.accessToken}
            initialViewState={{
              latitude: MAPBOX_CONFIG.center.lat,
              longitude: MAPBOX_CONFIG.center.lng,
              zoom: MAPBOX_CONFIG.zoom.default,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={MAPBOX_CONFIG.style}
            onClick={handleMapClick}
            interactiveLayerIds={interactive ? undefined : []}
            doubleClickZoom={interactive}
            dragRotate={interactive}
            pitchWithRotate={interactive}
          >
            {/* Controls */}
            {showControls && (
              <>
                <NavigationControl position="top-right" />
                <GeolocateControl
                  position="top-right"
                  trackUserLocation={true}
                  showUserHeading={true}
                />
              </>
            )}

            {/* Markers */}
            {pickupLocation &&
              validateCoordinates(pickupLocation.lat, pickupLocation.lng) && (
                <CustomMarker
                  location={pickupLocation}
                  type="pickup"
                  onClick={() =>
                    handleMarkerClick(pickupLocation, "Pickup Location")
                  }
                />
              )}

            {destination &&
              validateCoordinates(destination.lat, destination.lng) && (
                <CustomMarker
                  location={destination}
                  type="destination"
                  onClick={() => handleMarkerClick(destination, "Destination")}
                />
              )}

            {driverLocation &&
              validateCoordinates(driverLocation.lat, driverLocation.lng) && (
                <CustomMarker
                  location={driverLocation}
                  type="driver"
                  onClick={() =>
                    handleMarkerClick(driverLocation, "Driver Location")
                  }
                />
              )}

            {/* POI Markers */}
            {showPOIs &&
              pois.map((poi) => (
                <CustomMarker
                  key={poi.id}
                  location={{
                    lat: poi.coordinates.lat,
                    lng: poi.coordinates.lng,
                    timestamp: new Date(),
                  }}
                  type="poi"
                  onClick={() => {
                    handleMarkerClick(
                      {
                        lat: poi.coordinates.lat,
                        lng: poi.coordinates.lng,
                        timestamp: new Date(),
                      },
                      `${poi.name} (${poi.type})`,
                    );
                    onPOISelect?.(poi);
                  }}
                />
              ))}

            {/* Location History Trail */}
            {showLocationHistory && locationHistory.length > 1 && (
              <Source
                id="location-history"
                type="geojson"
                data={{
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: locationHistory.map((point) => [
                      point.lng,
                      point.lat,
                    ]),
                  },
                }}
              >
                <Layer
                  id="location-history-line"
                  type="line"
                  paint={{
                    "line-color": "#10b981",
                    "line-width": 3,
                    "line-opacity": 0.7,
                  }}
                />
              </Source>
            )}

            {/* Route Layer */}
            {route && (
              <Source
                id="route"
                type="geojson"
                data={{
                  type: "Feature",
                  properties: {},
                  geometry: route.geometry as any,
                }}
              >
                <Layer
                  id="route-line"
                  type="line"
                  paint={{
                    "line-color": ROUTE_CONFIG.default.color,
                    "line-width": ROUTE_CONFIG.default.width,
                    "line-opacity": ROUTE_CONFIG.default.opacity,
                  }}
                />
              </Source>
            )}

            {/* Traffic Layer */}
            {showTraffic && (
              <Source
                id="traffic"
                type="vector"
                url="mapbox://mapbox.mapbox-traffic-v1"
              >
                <Layer
                  id="traffic-layer"
                  type="line"
                  source-layer="traffic"
                  paint={{
                    "line-width": 1.5,
                    "line-color": [
                      "case",
                      ["==", ["get", "congestion"], "low"],
                      "#00ff00",
                      ["==", ["get", "congestion"], "moderate"],
                      "#ffff00",
                      ["==", ["get", "congestion"], "heavy"],
                      "#ff0000",
                      ["==", ["get", "congestion"], "severe"],
                      "#8b0000",
                      "#000000",
                    ],
                  }}
                />
              </Source>
            )}

            {/* Popup */}
            {popup_info && (
              <Popup
                latitude={popup_info.location.lat}
                longitude={popup_info.location.lng}
                onClose={() => set_popup_info(null)}
                closeButton={true}
                closeOnClick={false}
                offset={[0, -10]}
              >
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{popup_info.type}</h3>
                  <p className="text-xs text-muted-foreground">
                    {popup_info.location.lat.toFixed(6)},{" "}
                    {popup_info.location.lng.toFixed(6)}
                  </p>
                  {popup_info.location.address && (
                    <p className="text-xs mt-1">{popup_info.location.address}</p>
                  )}
                </div>
              </Popup>
            )}
          </Map>

          {/* Loading Overlay */}
          {is_loading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Calculating route...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-4 bg-muted/30 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {pickupLocation && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: MARKER_CONFIG.pickup.color }}
                  />
                  <span className="text-muted-foreground">Pickup</span>
                </div>
              )}
              {destination && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: MARKER_CONFIG.destination.color }}
                  />
                  <span className="text-muted-foreground">Destination</span>
                </div>
              )}
              {driverLocation && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: MARKER_CONFIG.driver.color }}
                  />
                  <span className="text-muted-foreground">Driver</span>
                </div>
              )}
              {showPOIs && pois.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="text-muted-foreground">
                    POIs ({pois.length})
                  </span>
                </div>
              )}
              {showLocationHistory && locationHistory.length > 1 && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-green-500" />
                  <span className="text-muted-foreground">
                    Location History
                  </span>
                </div>
              )}
              {route && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-0.5 border-dashed"
                    style={{ backgroundColor: ROUTE_CONFIG.default.color }}
                  />
                  <span className="text-muted-foreground">Route</span>
                </div>
              )}
            </div>

            {/* Distance & Duration */}
            <div className="text-muted-foreground">
              {route && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    <span>{(route.distance / 1000).toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.round(route.duration / 60)} min</span>
                  </div>
                </div>
              )}
              {pickupLocation && destination && !route && (
                <div className="flex items-center gap-1">
                  <Navigation className="h-4 w-4" />
                  <span>
                    {calculateDistance(pickupLocation, destination).toFixed(1)}{" "}
                    km
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
