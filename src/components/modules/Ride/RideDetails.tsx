import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { MapboxMap } from "@/components/ui/mapbox-map";
import { RideStatusCard } from "@/components/ui/ride-status-card";
import { RideStatus, Role } from "@/constants";
import { cn } from "@/lib/utils";
import { useInitPaymentMutation } from "@/redux/features/payment/payment.api";
import {
  useCancelRideMutation,
  useUpdateRideStatusMutation,
} from "@/redux/features/ride/ride.api";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import type { IDriver, IRide } from "@/types";
import {
  AlertCircle,
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  MapPin,
  Navigation,
  Route,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface RideDetailsProps {
  ride: IRide;
  className?: string;
  onRideCancelled: () => void;
  onRideCompleted?: (ride: IRide, driver: IDriver) => void;
}

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

export function RideDetails({
  ride,
  className,
  onRideCancelled,
  onRideCompleted,
}: RideDetailsProps) {
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();
  const [updateRideStatus, { isLoading: isCompleting }] =
    useUpdateRideStatusMutation();
  const [initPayment, { isLoading: isInitiatingPayment }] =
    useInitPaymentMutation();
  const { data: userInfo } = useUserInfoQuery(undefined);

  // Validate ride coordinates
  const hasValidCoordinates =
    ride.pickupLocation &&
    ride.destination &&
    isValidCoordinate(ride.pickupLocation.lat, ride.pickupLocation.lng) &&
    isValidCoordinate(ride.destination.lat, ride.destination.lng);

  const handleCancelRide = async () => {
    try {
      await cancelRide(ride._id).unwrap();
      toast.success("🚫 Ride cancelled successfully");
      onRideCancelled();
    } catch {
      toast.error("❌ Failed to cancel ride. Please try again.");
    }
  };

  const handleCompleteRide = async () => {
    try {
      await updateRideStatus({
        id: ride._id,
        status: { status: RideStatus.COMPLETED },
      }).unwrap();
      toast.success("✅ Ride completed successfully!");

      // Call callback to show review modal if provided
      if (onRideCompleted && ride.driver && typeof ride.driver !== "string") {
        onRideCompleted(ride, ride.driver);
      }
    } catch {
      toast.error("❌ Failed to complete ride. Please try again.");
    }
  };

  const handleInitiatePayment = async () => {
    try {
      const response = await initPayment(ride._id).unwrap();
      if (response.data?.paymentUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("❌ Failed to initiate payment. Please try again.");
      }
    } catch {
      toast.error("❌ Failed to initiate payment. Please try again.");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color:
            "bg-chart-4 text-primary-foreground shadow-lg shadow-chart-4/25",
          icon: <Clock className="h-4 w-4" />,
          pulse: true,
        };
      case "accepted":
        return {
          color:
            "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          icon: <CheckCircle className="h-4 w-4" />,
          pulse: false,
        };
      case "in_transit":
        return {
          color:
            "bg-chart-2 text-primary-foreground shadow-lg shadow-chart-2/25",
          icon: <Car className="h-4 w-4" />,
          pulse: true,
        };
      case "completed":
        return {
          color:
            "bg-chart-1 text-primary-foreground shadow-lg shadow-chart-1/25",
          icon: <CheckCircle className="h-4 w-4" />,
          pulse: false,
        };
      case "cancelled":
        return {
          color:
            "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25",
          icon: <X className="h-4 w-4" />,
          pulse: false,
        };
      default:
        return {
          color: "bg-muted text-muted-foreground shadow-lg shadow-muted/25",
          icon: <AlertCircle className="h-4 w-4" />,
          pulse: false,
        };
    }
  };

  const statusConfig = getStatusConfig(ride.status);

  // Determine if the current user can complete the ride
  const canCompleteRide =
    userInfo?.data?.role === Role.RIDER &&
    ride.status === RideStatus.IN_TRANSIT;

  // Determine if payment can be initiated
  const canInitiatePayment =
    userInfo?.data?.role === Role.RIDER &&
    ride.status === RideStatus.COMPLETED &&
    (!ride.payment || ride.payment.status === "unpaid");

  const getDriverName = () => {
    if (!ride.driver) return "Not assigned";
    if (typeof ride.driver === "string") return ride.driver;
    if (typeof ride.driver.user === "string") return ride.driver.user;
    return ride.driver.user?.name || "Driver";
  };



  return (
    <GradientBackground className={cn("rounded-3xl", className)}>
      <Card className="relative overflow-hidden border shadow-2xl bg-card/95 backdrop-blur-sm rounded-3xl">
        <CardHeader className="border-b relative overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-bold">
              <div className="relative p-2 sm:p-3 bg-card rounded-2xl shadow-lg border">
                <Navigation className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  Your Journey
                </div>
                <div className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
                  Track your ride in real-time
                </div>
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

        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 relative">
          {/* Interactive Map - only show if coordinates are valid */}
          {hasValidCoordinates ? (
            <MapboxMap
              pickupLocation={{
                lat: parseFloat(ride.pickupLocation.lat),
                lng: parseFloat(ride.pickupLocation.lng),
              }}
              destination={{
                lat: parseFloat(ride.destination.lat),
                lng: parseFloat(ride.destination.lng),
              }}
              showControls={true}
              interactive={true}
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

          {/* Journey Route Details */}
          <div className="relative overflow-hidden bg-muted/50 rounded-2xl p-4 sm:p-6 lg:p-8 border backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="relative">
              <h3 className="flex items-center gap-3 text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Route className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                Location Details
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Pickup Location */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-6 h-6 bg-chart-2 rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 bg-chart-2/50 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-chart-2" />
                      <span className="font-bold text-chart-2 text-base sm:text-lg">
                        Pickup Location
                      </span>
                    </div>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Latitude:
                        </span>
                        <div className="font-mono font-semibold">
                          {ride.pickupLocation?.lat ?? "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Longitude:
                        </span>
                        <div className="font-mono font-semibold">
                          {ride.pickupLocation?.lng ?? "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-6 h-6 bg-destructive rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 bg-destructive/50 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-destructive" />
                      <span className="font-bold text-destructive text-base sm:text-lg">
                        Destination
                      </span>
                    </div>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Latitude:
                        </span>
                        <div className="font-mono font-semibold">
                          {ride.destination?.lat ?? "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Longitude:
                        </span>
                        <div className="font-mono font-semibold">
                          {ride.destination?.lng ?? "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price & Driver Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Price */}
            <div className="relative overflow-hidden bg-muted/50 rounded-2xl p-4 sm:p-6 lg:p-8 border backdrop-blur-sm">
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-chart-1 rounded-2xl shadow-lg">
                    <DollarSign className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-bold text-base sm:text-lg">
                      Ride Price
                    </span>
                    <div className="text-sm text-muted-foreground">
                      Total fare amount
                    </div>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-1 mb-2">
                  ${ride.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Payment processed securely
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="relative overflow-hidden bg-muted/50 rounded-2xl p-4 sm:p-6 lg:p-8 border backdrop-blur-sm">
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-bold text-base sm:text-lg">
                      Your Driver
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {ride.driver
                        ? "Assigned driver"
                        : "Searching for driver..."}
                    </div>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-4">
                  {getDriverName()}
                </div>
                {/*{ride.driver && ride.status !== 'requested' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}*/}
                {!ride.driver && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Finding your driver...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <RideStatusCard status={ride.status} />

          {/* Actions */}
          {(ride.status === "requested" || ride.status === "accepted") && (
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="pt-6 sm:pt-8">
                <Button
                  variant="destructive"
                  onClick={handleCancelRide}
                  disabled={isCancelling}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2 sm:mr-3" />
                      <span className="hidden sm:inline">
                        Cancelling Ride...
                      </span>
                      <span className="sm:hidden">Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      Cancel Ride
                    </>
                  )}
                </Button>
                <p className="text-center text-muted-foreground text-xs sm:text-sm mt-3">
                  You can cancel your ride anytime before pickup
                </p>
              </div>
            </div>
          )}

          {/* Complete Ride Action - only for riders when ride is in transit */}
          {canCompleteRide && (
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="pt-6 sm:pt-8">
                <Button
                  variant="default"
                  onClick={handleCompleteRide}
                  disabled={isCompleting}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-chart-1 hover:bg-chart-1/90 text-primary-foreground"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2 sm:mr-3" />
                      <span className="hidden sm:inline">
                        Completing Ride...
                      </span>
                      <span className="sm:hidden">Completing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      Complete Ride
                    </>
                  )}
                </Button>
                <p className="text-center text-muted-foreground text-xs sm:text-sm mt-3">
                  Mark this ride as completed once you have arrived at your
                  destination
                </p>
              </div>
            </div>
          )}

          {/* Payment Initiation Action - only for riders when ride is completed */}
          {canInitiatePayment && (
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="pt-6 sm:pt-8">
                <Button
                  variant="default"
                  onClick={handleInitiatePayment}
                  disabled={isInitiatingPayment}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isInitiatingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2 sm:mr-3" />
                      <span className="hidden sm:inline">
                        Initiating Payment...
                      </span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      Pay Now
                    </>
                  )}
                </Button>
                <p className="text-center text-muted-foreground text-xs sm:text-sm mt-3">
                  Complete your payment to finalize this ride
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </GradientBackground>
  );
}
