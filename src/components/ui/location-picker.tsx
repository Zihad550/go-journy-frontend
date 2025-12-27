import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Locate, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupIcon = new Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const destinationIcon = new Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
  title: string;
  type: 'pickup' | 'destination';
  initialPosition?: { lat: number; lng: number };
  pickupLocation?: { lat: number; lng: number };
  className?: string;
}

interface MapClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  set_selected_position: (position: LatLng | null) => void;
}

function MapClickHandler({
  onLocationSelect,
  set_selected_position,
}: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      set_selected_position(e.latlng);
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export function LocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  title,
  type,
  initialPosition,
  pickupLocation,
  className,
}: LocationPickerProps) {
  const [selected_position, set_selected_position] = useState<LatLng | null>(null);
  const [current_location, set_current_location] = useState<LatLng | null>(null);
  const [is_getting_location, set_is_getting_location] = useState(false);
  const mapRef = useRef<any>(null);

  // Default center (Dhaka, Bangladesh)
  const defaultCenter: [number, number] = [23.8103, 90.4125];

  useEffect(() => {
    if (initialPosition) {
      const position = new LatLng(initialPosition.lat, initialPosition.lng);
      set_selected_position(position);
    }
  }, [initialPosition]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      set_is_getting_location(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = new LatLng(latitude, longitude);
          set_current_location(newPosition);
          set_selected_position(newPosition);

          // Pan map to current location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }

          set_is_getting_location(false);
        },
        () => {
          set_is_getting_location(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  };

  const handleConfirm = () => {
    if (selected_position) {
      onLocationSelect(selected_position.lat, selected_position.lng);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card
        className={cn(
          'w-full max-w-4xl max-h-[90vh] overflow-hidden',
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin
              className={cn(
                'h-5 w-5',
                type === 'pickup' ? 'text-chart-2' : 'text-chart-1'
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
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Locate className="h-4 w-4" />
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
            <MapContainer
              center={
                initialPosition
                  ? [initialPosition.lat, initialPosition.lng]
                  : defaultCenter
              }
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapClickHandler
                onLocationSelect={(lat, lng) =>
                  set_selected_position(new LatLng(lat, lng))
                }
                set_selected_position={set_selected_position}
              />

              {/* Show pickup location marker when selecting destination */}
              {type === 'destination' && pickupLocation && (
                <Marker
                  position={[pickupLocation.lat, pickupLocation.lng]}
                  icon={pickupIcon}
                />
              )}

              {selected_position && (
                <Marker
                  position={[selected_position.lat, selected_position.lng]}
                  icon={type === 'pickup' ? pickupIcon : destinationIcon}
                />
              )}

              {current_location && (
                <Marker
                  position={[current_location.lat, current_location.lng]}
                  icon={defaultIcon}
                />
              )}
            </MapContainer>
          </div>

          <div className="p-4 border-t bg-muted/30">
            {/* Legend for destination picker */}
            {type === 'destination' && pickupLocation && (
              <div className="mb-3 p-2 bg-background/50 rounded-lg border">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Map Legend:
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                    <span>Pickup Location</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Destination</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selected_position ? (
                  <span>
                    Selected: {selected_position.lat.toFixed(6)},{' '}
                    {selected_position.lng.toFixed(6)}
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
                  disabled={!selected_position}
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
