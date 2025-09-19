import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Map } from 'leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

// Custom icons for pickup and destination
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

interface RideMapProps {
  pickupLocation: { lat: string | number; lng: string | number };
  destination: { lat: string | number; lng: string | number };
  driverLocation?: { lat: string | number; lng: string | number };
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
  showPOIs?: boolean;
  showLocationHistory?: boolean;
  onPOISelect?: (poi: any) => void;
  className?: string;
}

// Helper function to validate coordinates
function isValidCoordinate(
  lat: string | number,
  lng: string | number
): boolean {
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    isFinite(latNum) &&
    isFinite(lngNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lngNum >= -180 &&
    lngNum <= 180
  );
}

export function RideMap({
  pickupLocation,
  destination,
  className,
}: RideMapProps) {
  const mapRef = useRef<Map | null>(null);

  // Validate coordinates
  const isPickupValid = isValidCoordinate(
    pickupLocation.lat,
    pickupLocation.lng
  );
  const isDestinationValid = isValidCoordinate(
    destination.lat,
    destination.lng
  );
  const areBothValid = isPickupValid && isDestinationValid;

  // Calculate bounds to fit both markers (only if both are valid)
  const bounds = useMemo(() => {
    if (!areBothValid) return null;
    return new LatLngBounds([
      [Number(pickupLocation.lat), Number(pickupLocation.lng)],
      [Number(destination.lat), Number(destination.lng)],
    ]);
  }, [
    pickupLocation.lat,
    pickupLocation.lng,
    destination.lat,
    destination.lng,
    areBothValid,
  ]);

  // Calculate center point
  const center: [number, number] = useMemo(() => {
    // Default center (Dhaka, Bangladesh) for fallback
    const defaultCenter: [number, number] = [23.8103, 90.4125];

    if (!areBothValid) return defaultCenter;
    return [
      (Number(pickupLocation.lat) + Number(destination.lat)) / 2,
      (Number(pickupLocation.lng) + Number(destination.lng)) / 2,
    ];
  }, [
    areBothValid,
    pickupLocation.lat,
    pickupLocation.lng,
    destination.lat,
    destination.lng,
  ]);

  // Route line coordinates (only if both are valid)
  const routeCoordinates: [number, number][] = useMemo(() => {
    if (!areBothValid) return [];
    return [
      [Number(pickupLocation.lat), Number(pickupLocation.lng)],
      [Number(destination.lat), Number(destination.lng)],
    ];
  }, [
    pickupLocation.lat,
    pickupLocation.lng,
    destination.lat,
    destination.lng,
    areBothValid,
  ]);

  useEffect(() => {
    if (mapRef.current && bounds && areBothValid) {
      // Fit the map to show both markers with some padding
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, areBothValid]);

  // Show error state if coordinates are invalid
  if (!areBothValid) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Route className="h-5 w-5 text-primary" />
            </div>
            Route Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <Route className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Map Unavailable</h3>
              <p className="text-muted-foreground">
                {!isPickupValid && !isDestinationValid
                  ? 'Both pickup and destination coordinates are invalid.'
                  : !isPickupValid
                  ? 'Pickup location coordinates are invalid.'
                  : 'Destination coordinates are invalid.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Route className="h-5 w-5 text-primary" />
          </div>
          Route Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 relative">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            zoomControl={true}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Route line - only show if both coordinates are valid */}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                color="#6366f1"
                weight={4}
                opacity={0.8}
                dashArray="10, 10"
              />
            )}

            {/* Pickup marker - only show if valid */}
            {isPickupValid && (
              <Marker
                position={[
                  Number(pickupLocation.lat),
                  Number(pickupLocation.lng),
                ]}
                icon={pickupIcon}
              />
            )}

            {/* Destination marker - only show if valid */}
            {isDestinationValid && (
              <Marker
                position={[Number(destination.lat), Number(destination.lng)]}
                icon={destinationIcon}
              />
            )}
          </MapContainer>
        </div>

        {/* Map legend */}
        <div className="p-4 bg-muted/30 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span className="text-muted-foreground">Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-muted-foreground">Destination</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-primary border-dashed border-t-2 border-primary"></div>
                <span className="text-muted-foreground">Route</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              Distance:{' '}
              {areBothValid
                ? calculateDistance(pickupLocation, destination).toFixed(1)
                : 'N/A'}{' '}
              km
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate distance between two points
function calculateDistance(
  point1: { lat: string | number; lng: string | number },
  point2: { lat: string | number; lng: string | number }
): number {
  // Validate inputs
  if (
    !isValidCoordinate(point1.lat, point1.lng) ||
    !isValidCoordinate(point2.lat, point2.lng)
  ) {
    return 0;
  }

  const lat1 = Number(point1.lat);
  const lng1 = Number(point1.lng);
  const lat2 = Number(point2.lat);
  const lng2 = Number(point2.lng);

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
