import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { RideMap } from "@/components/ui/ride-map";
import { cn } from "@/lib/utils";
import type { IRide } from "@/types";
import {
  Car,
  DollarSign,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Route,
  User,
} from "lucide-react";
import { DriverActionPanel } from "./DriverActionPanel";

interface DriverRideDetailsProps {
  ride: IRide;
  className?: string;
  onRideStatusChanged: (newStatus: string) => void;
}

export function DriverRideDetails({
  ride,
  className,
  onRideStatusChanged,
}: DriverRideDetailsProps) {
  // Helper function to validate coordinates
  function isValidCoordinate(
    lat: string | number,
    lng: string | number,
  ): boolean {
    const numLat = typeof lat === "string" ? parseFloat(lat) : lat;
    const numLng = typeof lng === "string" ? parseFloat(lng) : lng;

    return (
      !isNaN(numLat) &&
      !isNaN(numLng) &&
      isFinite(numLat) &&
      isFinite(numLng) &&
      numLat >= -90 &&
      numLat <= 90 &&
      numLng >= -180 &&
      numLng <= 180
    );
  }

  // Validate ride coordinates
  const hasValidCoordinates =
    ride.pickupLocation &&
    ride.destination &&
    isValidCoordinate(ride.pickupLocation.lat, ride.pickupLocation.lng) &&
    isValidCoordinate(ride.destination.lat, ride.destination.lng);

  // Calculate driver earnings (assuming 80% goes to driver, 20% platform fee)
  const platformFeePercentage = 0.2;
  const driverEarnings = ride.price * (1 - platformFeePercentage);
  const platformFee = ride.price * platformFeePercentage;

  // Get rider information
  const getRiderInfo = () => {
    if (!ride.rider) return { name: "Unknown Rider", phone: null };
    if (typeof ride.rider === "string")
      return { name: ride.rider, phone: null };
    return {
      name: ride.rider.name || "Unknown Rider",
      phone: ride.rider.phone || null,
    };
  };

  const riderInfo = getRiderInfo();
  const getDriverStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          color:
            "bg-chart-1 text-primary-foreground shadow-lg shadow-chart-1/25",
          icon: <Car className="h-4 w-4" />,
          pulse: true,
          message: "Head to pickup location",
        };
      case "in_transit":
        return {
          color:
            "bg-chart-2 text-primary-foreground shadow-lg shadow-chart-2/25",
          icon: <Navigation className="h-4 w-4" />,
          pulse: true,
          message: "En route to destination",
        };
      case "completed":
        return {
          color:
            "bg-chart-1 text-primary-foreground shadow-lg shadow-chart-1/25",
          icon: <Car className="h-4 w-4" />,
          pulse: false,
          message: "Trip completed successfully",
        };
      case "cancelled":
        return {
          color:
            "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25",
          icon: <Car className="h-4 w-4" />,
          pulse: false,
          message: "Trip was cancelled",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground shadow-lg shadow-muted/25",
          icon: <Car className="h-4 w-4" />,
          pulse: false,
          message: "Ride status unknown",
        };
    }
  };

  const statusConfig = getDriverStatusConfig(ride.status);

  return (
    <GradientBackground className={cn("rounded-3xl", className)}>
      <Card className="relative overflow-hidden border shadow-2xl bg-card/95 backdrop-blur-sm rounded-3xl">
        <CardHeader className="border-b relative overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-bold">
              <div className="relative p-2 sm:p-3 bg-card rounded-2xl shadow-lg border">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 text-chart-1" />
                <div className="absolute inset-0 bg-chart-1/10 rounded-2xl blur-sm" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">Active Ride</div>
              </div>
            </CardTitle>
            <Badge
              className={cn(
                "px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border-0 self-start sm:self-auto",
                statusConfig.color,
                statusConfig.pulse && "animate-pulse",
              )}
            >
              {statusConfig.icon}
              <span className="ml-2">
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 relative">
          {/* Driver Status Message */}
          <div className="relative overflow-hidden bg-muted/30 rounded-2xl p-3 sm:p-4 md:p-6 border backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-chart-1/10 rounded-2xl flex-shrink-0">
                {statusConfig.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-chart-1 break-words">
                  {statusConfig.message}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Ride ID: {ride._id.slice(-8)}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Earnings Card - Prominent Display */}
          <div className="relative overflow-hidden bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-chart-1/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-chart-1 rounded-2xl shadow-lg flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-base sm:text-lg md:text-xl text-chart-1 block">
                    Your Earnings
                  </span>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Driver portion after platform fee
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 text-center md:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-chart-1 mb-2 break-all">
                    ${driverEarnings.toFixed(2)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Your take-home amount
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 border">
                    <div className="text-xs text-muted-foreground">
                      Total Fare
                    </div>
                    <div className="font-bold text-sm sm:text-base md:text-lg">
                      ${ride.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 border">
                    <div className="text-xs text-muted-foreground">
                      Platform Fee
                    </div>
                    <div className="font-semibold text-sm text-muted-foreground">
                      -${platformFee.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rider Contact Information */}
          <div className="relative overflow-hidden bg-muted/50 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-primary rounded-2xl shadow-lg flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-base sm:text-lg md:text-xl block">
                    Rider Information
                  </span>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Contact details and preferences
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Rider Name
                    </div>
                    <div className="font-bold text-lg sm:text-xl break-words">
                      {riderInfo.name}
                    </div>
                  </div>

                  {riderInfo.phone && (
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                        Phone Number
                      </div>
                      <div className="font-semibold text-base sm:text-lg break-all">
                        {riderInfo.phone}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {riderInfo.phone && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl touch-manipulation"
                      >
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        Call Rider
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl touch-manipulation"
                      >
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        Message Rider
                      </Button>
                    </>
                  )}
                  {!riderInfo.phone && (
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border text-center">
                      <div className="text-muted-foreground text-xs sm:text-sm">
                        Contact information not available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation and Route Information */}
          <div className="space-y-6">
            {/* Interactive Map - only show if coordinates are valid */}
            {hasValidCoordinates ? (
              <RideMap
                pickupLocation={{
                  lat: parseFloat(ride.pickupLocation.lat),
                  lng: parseFloat(ride.pickupLocation.lng),
                }}
                destination={{
                  lat: parseFloat(ride.destination.lat),
                  lng: parseFloat(ride.destination.lng),
                }}
              />
            ) : (
              <Card className="overflow-hidden">
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
                      <h3 className="font-semibold text-lg mb-2">
                        Map Unavailable
                      </h3>
                      <p className="text-muted-foreground">
                        Location coordinates are not available for this ride.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Driver-focused Location Details */}
            <div className="relative overflow-hidden bg-muted/50 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border backdrop-blur-sm">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="relative">
                <h3 className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                    <Navigation className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <span>Navigation Details</span>
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Next Destination Based on Status */}
                  {ride.status === "accepted" && (
                    <div className="lg:col-span-2 mb-2 sm:mb-4">
                      <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-2 rounded-full animate-pulse flex-shrink-0"></div>
                          <span className="font-bold text-chart-2 text-sm sm:text-base md:text-lg">
                            Next: Head to Pickup Location
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Navigate to the pickup point to collect your rider
                        </p>
                      </div>
                    </div>
                  )}

                  {ride.status === "in_transit" && (
                    <div className="lg:col-span-2 mb-2 sm:mb-4">
                      <div className="bg-chart-1/10 border border-chart-1/20 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-1 rounded-full animate-pulse flex-shrink-0"></div>
                          <span className="font-bold text-chart-1 text-sm sm:text-base md:text-lg">
                            Next: Navigate to Destination
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Take your rider to their destination safely
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pickup Location */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-chart-2 rounded-full shadow-lg"></div>
                        {ride.status === "accepted" && (
                          <div className="absolute inset-0 bg-chart-2/50 rounded-full animate-ping opacity-20"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-chart-2 flex-shrink-0" />
                        <span className="font-bold text-chart-2 text-sm sm:text-base md:text-lg truncate">
                          Pickup Location
                        </span>
                      </div>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border shadow-sm">
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Latitude:
                          </span>
                          <div className="font-mono font-semibold text-sm sm:text-base break-all">
                            {ride.pickupLocation?.lat ?? "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Longitude:
                          </span>
                          <div className="font-mono font-semibold text-sm sm:text-base break-all">
                            {ride.pickupLocation?.lng ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-destructive rounded-full shadow-lg"></div>
                        {ride.status === "in_transit" && (
                          <div className="absolute inset-0 bg-destructive/50 rounded-full animate-ping opacity-20"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
                        <span className="font-bold text-destructive text-sm sm:text-base md:text-lg truncate">
                          Destination
                        </span>
                      </div>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border shadow-sm">
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Latitude:
                          </span>
                          <div className="font-mono font-semibold text-sm sm:text-base break-all">
                            {ride.destination?.lat ?? "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Longitude:
                          </span>
                          <div className="font-mono font-semibold text-sm sm:text-base break-all">
                            {ride.destination?.lng ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Action Panel */}
          <DriverActionPanel
            ride={ride}
            onRideStatusChanged={onRideStatusChanged}
          />
        </CardContent>
      </Card>
    </GradientBackground>
  );
}
