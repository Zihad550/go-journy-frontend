import { RequestRideForm } from "@/components/modules/Ride/RequestRideForm";
import { RideDetails } from "@/components/modules/Ride/RideDetails";
import { useGetRidesQuery } from "@/redux/features/ride/ride.api";
import type { IRide } from "@/types";
import { useEffect, useState } from "react";

interface RiderHeroContentProps {
  onRideRequested: (ride: IRide) => void;
  onRideCancelled: () => void;
}

export function RiderHeroContent({
  onRideRequested,
  onRideCancelled,
}: RiderHeroContentProps) {
  const [currentRide, setCurrentRide] = useState<IRide | null>(null);
  const { data: ridesResponse, isLoading, error } = useGetRidesQuery(undefined);

  useEffect(() => {
    if (ridesResponse?.data) {
      // Find the current user's active ride (not completed or cancelled)
      const activeRide = ridesResponse.data.find(
        (ride) => ride.status !== "completed" && ride.status !== "cancelled",
      );
      setCurrentRide(activeRide || null);
    }
  }, [ridesResponse]);

  const handleRideRequested = (ride: IRide) => {
    setCurrentRide(ride);
    onRideRequested(ride);
  };

  const handleRideCancelled = () => {
    setCurrentRide(null);
    onRideCancelled();
  };

  if (isLoading) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading your rides...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center py-8">
            <p className="text-destructive">
              Failed to load rides. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
        {!currentRide ? (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
              Book Your Next Ride
            </h2>
            <RequestRideForm onRideRequested={handleRideRequested} />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
              Your Current Ride
            </h2>
            <RideDetails
              ride={currentRide}
              onRideCancelled={handleRideCancelled}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
