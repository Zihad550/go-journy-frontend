import { InterestedDrivers } from "@/components/modules/ride/interested-drivers";
import { RequestRideForm } from "@/components/modules/ride/request-ride-form";
import { ReviewModal } from "@/components/modules/ride/review-modal";
import { RideDetails } from "@/components/modules/ride/ride-details";
import { CardLoader } from "@/components/ui/card-loader";
import { GradientBackground } from "@/components/ui/gradient-background";
import { useGetRidesQuery } from "@/redux/features/ride/ride-api";
import type { IRide, IDriver } from "@/types";
import { Car, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface RiderHeroContentProps {
  onRideRequested?: (ride: IRide) => void;
  onRideCancelled?: () => void;
  defaultFormValues?: {
    pickupLat?: string;
    pickupLng?: string;
    destinationLat?: string;
    destinationLng?: string;
    price?: string;
  };
}

export function RiderHeroContent({
  onRideRequested,
  onRideCancelled,
  defaultFormValues,
}: RiderHeroContentProps) {
  console.log("default form values -", defaultFormValues);
  const [currentRide, setCurrentRide] = useState<IRide | null>(null);
  const [reviewData, setReviewData] = useState<{
    ride: IRide;
    driver: IDriver;
  } | null>(null);
  const {
    data: ridesResponse,
    isLoading,
    error,
  } = useGetRidesQuery(undefined, {
    pollingInterval: import.meta.env.VITE_APP_RIDE_REFETCH,
  });

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
    onRideRequested?.(ride);
  };

  const handleRideCancelled = () => {
    setCurrentRide(null);
    onRideCancelled?.();
  };

  const handleRideCompleted = (ride: IRide, driver: IDriver) => {
    setReviewData({ ride, driver });
  };

  const handleReviewModalClose = () => {
    setReviewData(null);
  };

  if (isLoading) {
    return (
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GradientBackground className="rounded-2xl">
          <CardLoader
            message="Loading your rides..."
            className="bg-transparent border-0 shadow-none"
          />
        </GradientBackground>
      </div>
    );
  }

  if (error && error?.status !== 404) {
    console.log("error -", error);
    return (
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GradientBackground className="rounded-2xl">
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-8 shadow-xl">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <Car className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Unable to Load Rides
              </h3>
              <p className="text-muted-foreground">
                We're having trouble loading your rides. Please check your
                connection and try again.
              </p>
            </div>
          </div>
        </GradientBackground>
      </div>
    );
  }
  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <GradientBackground className="rounded-2xl">
        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl shadow-xl overflow-hidden">
          {!currentRide ? (
            <div className="p-8">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Book Your Next Ride
                </h2>
                <p className="text-muted-foreground text-lg">
                  Get connected with nearby drivers in minutes
                </p>
              </div>

              {/* Form Section */}
              <div className="max-w-3xl mx-auto">
                <RequestRideForm
                  onRideRequested={handleRideRequested}
                  defaultValues={defaultFormValues}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {currentRide.status === "requested" ? (
                <>
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-primary/20 via-chart-1/20 to-chart-2/20 p-8 border-b border-border/30">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-chart-4/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-chart-4" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Finding Your Driver
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        Drivers are showing interest in your ride request
                      </p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="space-y-4 min-w-0">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Ride Details
                          </h3>
                        </div>
                        <RideDetails
                          ride={currentRide}
                          onRideCancelled={handleRideCancelled}
                          onRideCompleted={handleRideCompleted}
                          className="max-w-none"
                        />
                      </div>

                      <div className="space-y-4 min-w-0">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Available Drivers
                          </h3>
                        </div>
                        <InterestedDrivers ride={currentRide} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Header for active ride */}
                  <div className="bg-gradient-to-r from-chart-1/20 via-primary/20 to-chart-2/20 p-8 border-b border-border/30">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-chart-1/20 flex items-center justify-center">
                        <Car className="w-8 h-8 text-chart-1" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Your Current Ride
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        Track your journey in real-time
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                      <RideDetails
                        ride={currentRide}
                        onRideCancelled={handleRideCancelled}
                        onRideCompleted={handleRideCompleted}
                        className="max-w-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {reviewData && (
          <ReviewModal
            isOpen={!!reviewData}
            onClose={handleReviewModalClose}
            ride={reviewData.ride}
            driver={reviewData.driver}
          />
        )}
      </GradientBackground>
    </div>
  );
}
