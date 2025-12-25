import React, { useEffect, useState } from "react";
import { useCalculateETAMutation } from "@/redux/features/location/location-api";
import { useWebSocket } from "@/lib/websocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Navigation, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ETADisplayProps {
  rideId: string;
  currentLocation?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  className?: string;
  showRoute?: boolean;
  autoUpdate?: boolean;
  updateInterval?: number; // in seconds
}

interface ETAData {
  eta: string;
  duration: number; // in seconds
  distance: number; // in meters
  trafficDelay: number; // in seconds
  route?: {
    geometry: {
      type: string;
      coordinates: number[][];
    };
    duration: number;
    distance: number;
  };
}

const ETADisplay: React.FC<ETADisplayProps> = ({
  rideId,
  currentLocation,
  destination,
  className,
  showRoute = false,
  autoUpdate = true,
  updateInterval = 30, // 30 seconds
}) => {
  const [etaData, setEtaData] = useState<ETAData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isStale, setIsStale] = useState(false);

  const [calculateETA, { isLoading: isCalculatingETA, error: etaError }] =
    useCalculateETAMutation();
  const { onETAUpdate, isConnected } = useWebSocket();

  // Calculate ETA
  const fetchETA = async () => {
    if (!currentLocation || !destination) return;

    try {
      const result = await calculateETA({
        rideId,
        currentLocation,
      }).unwrap();

      if (result.data) {
        setEtaData(result.data);
        setLastUpdate(new Date());
        setIsStale(false);
      }
    } catch {
      toast.error("Failed to calculate ETA");
    }
  };

  // WebSocket ETA updates
  useEffect(() => {
    const unsubscribe = onETAUpdate((data) => {
      if (data.rideId === rideId) {
        // WebSocket ETA update doesn't have all fields, so we'll keep existing data
        // and just update the ETA time
        setEtaData((prev) =>
          prev
            ? {
                ...prev,
                eta: data.eta,
              }
            : null,
        );
        setLastUpdate(new Date());
        setIsStale(false);
      }
    });

    return unsubscribe;
  }, [rideId, onETAUpdate]);

  // Auto-update ETA
  useEffect(() => {
    if (!autoUpdate || !currentLocation || !destination) return;

    // Initial fetch
    fetchETA();

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchETA();
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [autoUpdate, currentLocation, destination, updateInterval]);

  // Check if ETA is stale
  useEffect(() => {
    const checkStale = () => {
      const now = new Date();
      const diffInMinutes =
        (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

      if (diffInMinutes > 5) {
        // Consider stale after 5 minutes
        setIsStale(true);
      }
    };

    const staleCheckInterval = setInterval(checkStale, 60000); // Check every minute
    return () => clearInterval(staleCheckInterval);
  }, [lastUpdate]);

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

  // Calculate arrival time
  const getArrivalTime = (): string => {
    if (!etaData) return "--:--";

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + etaData.duration * 1000);

    return arrivalTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get traffic status
  const getTrafficStatus = (): { status: string; color: string } => {
    if (!etaData || etaData.trafficDelay === 0) {
      return { status: "Clear", color: "bg-green-500" };
    }

    const delayMinutes = etaData.trafficDelay / 60;

    if (delayMinutes < 5) {
      return { status: "Light", color: "bg-yellow-500" };
    } else if (delayMinutes < 15) {
      return { status: "Moderate", color: "bg-orange-500" };
    } else {
      return { status: "Heavy", color: "bg-red-500" };
    }
  };

  if (!rideId) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No ride specified</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trafficStatus = getTrafficStatus();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Estimated Time of Arrival
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected() ? "default" : "destructive"}
              className="text-xs"
            >
              {isConnected() ? "Live" : "Offline"}
            </Badge>
            {isStale && (
              <Badge variant="outline" className="text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Stale
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {etaData ? (
          <>
            {/* Main ETA Display */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {getArrivalTime()}
              </div>
              <div className="text-sm text-muted-foreground">Arrival Time</div>
            </div>

            {/* ETA Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-semibold text-primary">
                  {formatDuration(etaData.duration)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Time Remaining
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-semibold text-primary">
                  {formatDistance(etaData.distance)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Distance Left
                </div>
              </div>
            </div>

            {/* Traffic Information */}
            {etaData.trafficDelay > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={cn("w-3 h-3 rounded-full", trafficStatus.color)}
                  />
                  <span className="text-sm font-medium">
                    Traffic: {trafficStatus.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  +{formatDuration(etaData.trafficDelay)}
                </div>
              </div>
            )}

            {/* Route Information */}
            {showRoute && etaData.route && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4" />
                  <span className="font-medium">Route Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Duration: {formatDuration(etaData.route.duration)}</div>
                  <div>Distance: {formatDistance(etaData.route.distance)}</div>
                </div>
              </div>
            )}

            {/* Last Update */}
            <div className="text-xs text-muted-foreground text-center">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            {isCalculatingETA ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Calculating ETA...
                </span>
              </div>
            ) : (
              <div>
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {etaError ? "Failed to calculate ETA" : "ETA not available"}
                </p>
                <button
                  onClick={fetchETA}
                  className="mt-2 text-xs text-primary hover:underline"
                  disabled={!currentLocation || !destination}
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Update Button */}
        {etaData && autoUpdate && (
          <div className="text-center">
            <button
              onClick={fetchETA}
              disabled={isCalculatingETA}
              className="text-xs text-primary hover:underline disabled:opacity-50"
            >
              {isCalculatingETA ? "Updating..." : "Update now"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ETADisplay;
