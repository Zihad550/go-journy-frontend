"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/mapbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MAPBOX_CONFIG,
  MARKER_CONFIG,
  validateCoordinates,
  GEOLOCATION_OPTIONS,
} from "@/config";
import { MapPin, Locate, Check, X, Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
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

interface MapboxLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  title: string;
  type: "pickup" | "destination";
  initialLocation?: Location;
  pickupLocation?: Location;
  className?: string;
}

interface CustomMarkerProps {
  location: Location;
  type: "pickup" | "destination" | "selected";
  onClick?: () => void;
}

// Custom Marker Component
function CustomMarker({ location, type, onClick }: CustomMarkerProps) {
  const config =
    MARKER_CONFIG[type as keyof typeof MARKER_CONFIG] || MARKER_CONFIG.pickup;

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
          <MapPin
            className="w-full h-full p-1 text-white"
            fill="currentColor"
          />
        </div>

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

// Main MapboxLocationPicker Component
export function MapboxLocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  title,
  type,
  initialLocation,
  pickupLocation,
  className,
}: MapboxLocationPickerProps) {
  const mapRef = useRef<any>(null);
  const [selected_location, set_selected_location] = useState<Location | null>(
    null,
  );
  const [current_location, set_current_location] = useState<Location | null>(null);
  const [is_getting_location, set_is_getting_location] = useState(false);
  const [popup_info, set_popup_info] = useState<{
    location: Location;
    type: string;
  } | null>(null);

  // Initialize selected location from initialLocation
  useEffect(() => {
    if (
      initialLocation &&
      validateCoordinates(initialLocation.lat, initialLocation.lng)
    ) {
      set_selected_location(initialLocation);
    }
  }, [initialLocation]);

  // Get current device location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    set_is_getting_location(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } =
          position.coords;
        const location: Location = {
          lat: latitude,
          lng: longitude,
          accuracy,
          heading: heading || undefined,
          speed: speed || undefined,
          timestamp: new Date(),
        };

        set_current_location(location);
        set_selected_location(location);

        // Pan map to current location
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 2000,
          });
        }

        set_is_getting_location(false);
      },
      () => {
        toast.error("Error getting location:");
        set_is_getting_location(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  // Handle map click for location selection
  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    const location: Location = {
      lat,
      lng,
      timestamp: new Date(),
    };

    set_selected_location(location);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((location: Location, type: string) => {
    set_popup_info({ location, type });
  }, []);

  // Confirm selected location
  const handleConfirm = useCallback(() => {
    if (selected_location) {
      onLocationSelect(selected_location);
      onClose();
    }
  }, [selected_location, onLocationSelect, onClose]);

  // Calculate map bounds to show both pickup and destination
  const calculateBounds = useCallback(() => {
    const locations: Location[] = [];

    if (pickupLocation) locations.push(pickupLocation);
    if (selected_location) locations.push(selected_location);

    if (locations.length === 0) return null;

    const lats = locations.map((loc) => loc.lat);
    const lngs = locations.map((loc) => loc.lng);

    return [
      [Math.min(...lngs), Math.min(...lats)], // Southwest
      [Math.max(...lngs), Math.max(...lats)], // Northeast
    ];
  }, [pickupLocation, selected_location]);

  // Fit bounds when locations change
  useEffect(() => {
    if (pickupLocation || selected_location) {
      const bounds = calculateBounds();
      if (bounds && mapRef.current) {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    }
  }, [pickupLocation, selected_location, calculateBounds]);

  // Don't render if not open
  if (!isOpen) return null;

  // Validate Mapbox token
  if (
    !MAPBOX_CONFIG.accessToken ||
    MAPBOX_CONFIG.accessToken === "your_mapbox_access_token_here"
  ) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card
          className={cn(
            "w-full max-w-4xl max-h-[90vh] overflow-hidden",
            className,
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin
                className={cn(
                  "h-5 w-5",
                  type === "pickup" ? "text-green-500" : "text-red-500",
                )}
              />
              {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="p-4 bg-muted/50 rounded-full">
                <MapPin className="h-8 w-8 text-muted-foreground" />
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
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-4xl max-h-[90vh] overflow-hidden",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin
              className={cn(
                "h-5 w-5",
                type === "pickup" ? "text-green-500" : "text-red-500",
              )}
            />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={is_getting_location}
            >
              {is_getting_location ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Locate className="h-4 w-4 mr-2" />
              )}
              Current Location
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-96 relative">
            <Map
              ref={mapRef}
              mapboxAccessToken={MAPBOX_CONFIG.accessToken}
              initialViewState={{
                latitude: initialLocation?.lat || MAPBOX_CONFIG.center.lat,
                longitude: initialLocation?.lng || MAPBOX_CONFIG.center.lng,
                zoom: MAPBOX_CONFIG.zoom.default,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle={MAPBOX_CONFIG.style}
              onClick={handleMapClick}
            >
              {/* Controls */}
              <NavigationControl position="top-right" />
              <GeolocateControl
                position="top-right"
                trackUserLocation={true}
                showUserHeading={true}
              />

              {/* Pickup location marker (when selecting destination) */}
              {type === "destination" &&
                pickupLocation &&
                validateCoordinates(pickupLocation.lat, pickupLocation.lng) && (
                  <CustomMarker
                    location={pickupLocation}
                    type="pickup"
                    onClick={() =>
                      handleMarkerClick(pickupLocation, "Pickup Location")
                    }
                  />
                )}

              {/* Selected location marker */}
              {selected_location &&
                validateCoordinates(
                  selected_location.lat,
                  selected_location.lng,
                ) && (
                  <CustomMarker
                    location={selected_location}
                    type={type}
                    onClick={() =>
                      handleMarkerClick(selected_location, "Selected Location")
                    }
                  />
                )}

              {/* Current location marker */}
              {current_location &&
                validateCoordinates(
                  current_location.lat,
                  current_location.lng,
                ) && (
                  <CustomMarker
                    location={current_location}
                    type="selected"
                    onClick={() =>
                      handleMarkerClick(current_location, "Current Location")
                    }
                  />
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
                    {popup_info.location.accuracy && (
                      <p className="text-xs mt-1">
                        Accuracy: ±{popup_info.location.accuracy.toFixed(0)}m
                      </p>
                    )}
                  </div>
                </Popup>
              )}
            </Map>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/30">
            {/* Legend for destination picker */}
            {type === "destination" && pickupLocation && (
              <div className="mb-3 p-2 bg-background/50 rounded-lg border">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Map Legend:
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MARKER_CONFIG.pickup.color }}
                    />
                    <span>Pickup Location</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: MARKER_CONFIG.destination.color,
                      }}
                    />
                    <span>Destination</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selected_location ? (
                  <span>
                    Selected: {selected_location.lat.toFixed(6)},{" "}
                    {selected_location.lng.toFixed(6)}
                  </span>
                ) : (
                  <span>Click on the map to select a location</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selected_location}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirm Location
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
