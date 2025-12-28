import { DriverRideDetails } from "@/components/modules/ride/driver-ride-details";
import { DriverRideFilters } from "@/components/ui/driver-ride-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardLoader } from "@/components/ui/card-loader";
import { ButtonSpinner } from "@/components/ui/spinner";
import { RideStatus } from "@/constants";
import { useGetDriverProfileQuery } from "@/redux/features/driver/driver-api";
import {
  useGetAvailableRidesQuery,
  useShowInterestMutation,
} from "@/redux/features/ride/ride-api";
import type { IRide, ObjectValues, IRideFilters } from "@/types";
import { CheckCircle, Clock, DollarSign, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";

interface DriverHeroContentProps {
  onRideAccepted?: (ride: IRide) => void;
}

export function DriverHeroContent({ onRideAccepted }: DriverHeroContentProps) {
  const [searchParams] = useSearchParams();
  const [active_ride, set_active_ride] = useState<IRide | null>(null);
  const [filters, setFilters] = useState<IRideFilters>({
    minPrice: searchParams.get("minPrice")
      ? Number.parseFloat(searchParams.get("minPrice")!)
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number.parseFloat(searchParams.get("maxPrice")!)
      : undefined,
    riderName: searchParams.get("riderName") || undefined,
    pickupLat: searchParams.get("pickupLat") || undefined,
    pickupLng: searchParams.get("pickupLng") || undefined,
    destLat: searchParams.get("destLat") || undefined,
    destLng: searchParams.get("destLng") || undefined,
  });

  const debouncedFilters = useDebounce(filters, 500);

  const {
    data: ridesResponse,
    isLoading,
    error,
  } = useGetAvailableRidesQuery(debouncedFilters, {
    pollingInterval: import.meta.env.VITE_APP_RIDE_REFETCH,
  });
  const { data: driverProfileResponse } = useGetDriverProfileQuery(undefined);

  const [showInterest, { isLoading: isShowingInterest }] =
    useShowInterestMutation();

  useEffect(() => {
    if (ridesResponse?.data) {
      // Find the driver's active ride (accepted or in_transit)
      const driverActiveRide = ridesResponse.data.find(
        (ride) => ride.status === "accepted" || ride.status === "in_transit",
      );
      set_active_ride(driverActiveRide || null);

      // Notify parent if there's an active ride
      if (driverActiveRide && onRideAccepted) {
        onRideAccepted(driverActiveRide);
      }
    }
  }, [ridesResponse, onRideAccepted]);

  const handleShowInterest = async (rideId: string) => {
    try {
      await showInterest(rideId).unwrap();
      toast.success("Interest shown successfully! 🚗");
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to show interest"
          : "Failed to show interest";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <CardLoader message="Loading available rides..." />
      </div>
    );
  }

  if (error || !driverProfileResponse?.data?._id) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl">
          <CardContent className="text-center py-8">
            <p className="text-destructive">
              Failed to load rides. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle ride status changes
  const handleRideStatusChanged = (newStatus: string) => {
    // If ride is completed or cancelled, clear active ride
    if (newStatus === "completed" || newStatus === "cancelled") {
      set_active_ride(null);
    } else {
      // Update active ride status
      set_active_ride((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as ObjectValues<typeof RideStatus>,
            }
          : null,
      );
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // If driver has an active ride, show driver-specific ride details
  if (active_ride) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <DriverRideDetails
          ride={active_ride}
          onRideStatusChanged={handleRideStatusChanged}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  // Filter available rides (requested status only)
  const availableRides =
    ridesResponse?.data?.filter((ride) => ride.status === "requested") || [];

  return (
    <div className="mt-12 max-w-6xl mx-auto space-y-6">
      {/* Filter Section - Desktop */}
      <div className="hidden lg:block">
        <DriverRideFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          isMobile={false}
        />
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Available Ride Requests
              </CardTitle>
              <p className="text-muted-foreground">
                Show interest in rides to get selected by riders
              </p>
            </div>

            {/* Filter Section - Mobile */}
            <div className="lg:hidden">
              <DriverRideFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                isMobile={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {availableRides.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Available Rides
              </h3>
              <p className="text-muted-foreground">
                Check back later for new ride requests in your area.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRides.map((ride) => (
                <RideRequestCard
                  key={ride._id}
                  ride={ride}
                  onShowInterest={handleShowInterest}
                  isLoading={isShowingInterest}
                  currentDriverId={driverProfileResponse?.data?._id as string}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface RideRequestCardProps {
  ride: IRide;
  onShowInterest: (rideId: string) => void;
  isLoading: boolean;
  currentDriverId: string;
}

function RideRequestCard({
  ride,
  onShowInterest,
  isLoading,
  currentDriverId,
}: RideRequestCardProps) {
  const riderName =
    typeof ride.rider === "object" ? ride.rider.name : "Unknown Rider";
  const interestedCount = ride.interestedDrivers?.length || 0;

  return (
    <Card className="border border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">{riderName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {interestedCount} interested
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pickup Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Pickup</p>
            <p className="text-sm font-medium truncate">
              {ride.pickupLocation.lat}, {ride.pickupLocation.lng}
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="text-sm font-medium truncate">
              {ride.destination.lat}, {ride.destination.lng}
            </p>
          </div>
        </div>

        {/* Price and Time */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-chart-1" />
            <span className="font-semibold text-lg">${ride.price}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{new Date(ride.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Show Interest Button */}
        <Button
          onClick={() => onShowInterest(ride._id)}
          disabled={
            isLoading || ride?.interestedDrivers?.includes(currentDriverId)
          }
          className="w-full mt-4"
          size="sm"
          variant={
            ride?.interestedDrivers?.includes(currentDriverId)
              ? "secondary"
              : "default"
          }
        >
          {isLoading ? (
            <ButtonSpinner />
          ) : ride?.interestedDrivers?.includes(currentDriverId) ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : null}
          {ride?.interestedDrivers?.includes(currentDriverId)
            ? "Interested"
            : "Show Interest"}
        </Button>
      </CardContent>
    </Card>
  );
}
