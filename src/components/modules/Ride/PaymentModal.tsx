import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonSpinner } from "@/components/ui/spinner";
import { useInitPaymentMutation } from "@/redux/features/payment/payment.api";
import type { IRide, IDriver } from "@/types";
import {
  CreditCard,
  DollarSign,
  MapPin,
  Route,
  User,
  Car,
  Star,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: IRide;
  selectedDriver: string | IDriver;
}

export function PaymentModal({
  isOpen,
  onClose,
  ride,
  selectedDriver,
}: PaymentModalProps) {
  const [initPayment, { isLoading: isInitiatingPayment }] =
    useInitPaymentMutation();
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success" | "error">("confirm");

  // Get driver information
  const driverName = typeof selectedDriver === "string"
    ? "Driver"
    : (typeof selectedDriver.user === "string" ? selectedDriver.user : (selectedDriver.user?.name || "Driver"));
  const vehicleName = typeof selectedDriver === "string" ? "Vehicle" : (selectedDriver.vehicle?.name || "Vehicle");
  const vehicleModel = typeof selectedDriver === "string" ? "" : (selectedDriver.vehicle?.model || "");
  const experience = typeof selectedDriver === "string" ? 0 : (selectedDriver.experience || 0);

  const handlePaymentInitiation = async () => {
    try {
      setPaymentStep("processing");

      // Store driver information for payment success callback
      const driverInfo = {
        rideId: ride._id,
        driverId: typeof selectedDriver === "string" ? selectedDriver : selectedDriver._id,
        driverName,
        vehicleName,
        vehicleModel,
        experience,
      };
      sessionStorage.setItem('pendingDriverAcceptance', JSON.stringify(driverInfo));

      // First, initiate payment
      const paymentResponse = await initPayment(ride._id).unwrap();

      if (paymentResponse.data?.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error("Failed to get payment URL");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setPaymentStep("error");
      toast.error("❌ Failed to initiate payment. Please try again.");
    }
  };



  const handleClose = () => {
    if (paymentStep !== "processing") {
      onClose();
      setPaymentStep("confirm");
    }
  };

  const renderContent = () => {
    switch (paymentStep) {
      case "confirm":
        return (
          <div className="space-y-6">
            {/* Ride Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Route className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ride Summary</h3>
                  <p className="text-sm text-muted-foreground">Review your journey details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-chart-2" />
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">
                    {ride.pickupLocation?.lat?.toString().slice(0, 7)}, {ride.pickupLocation?.lng?.toString().slice(0, 7)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-destructive" />
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">
                    {ride.destination?.lat?.toString().slice(0, 7)}, {ride.destination?.lng?.toString().slice(0, 7)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-chart-1" />
                  <span className="text-muted-foreground">Fare:</span>
                  <span className="font-bold text-chart-1">${ride.price}</span>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Selected Driver</h3>
                  <p className="text-sm text-muted-foreground">Your ride partner</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-foreground">{driverName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4" />
                    <span>{vehicleName} {vehicleModel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{experience} years experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payment Required</h3>
                  <p className="text-sm text-muted-foreground">Secure payment via SSLCommerz</p>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">${ride.price}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Payment will be held until ride completion</p>
                <p>• Funds released to driver after successful trip</p>
                <p>• Secure SSLCommerz payment gateway</p>
              </div>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ButtonSpinner size="sm" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Processing Payment</h3>
              <p className="text-muted-foreground">Please wait while we process your payment...</p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 text-green-600">✓</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-muted-foreground">Driver has been accepted. Your ride is confirmed!</p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 text-red-600">✕</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
              <p className="text-muted-foreground">Something went wrong. Please try again.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            {paymentStep === "confirm"
              ? "Review your ride details and complete payment to accept this driver"
              : paymentStep === "processing"
              ? "Processing your payment..."
              : paymentStep === "success"
              ? "Payment completed successfully!"
              : "Payment failed. Please try again."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderContent()}
        </div>

        <DialogFooter className="flex gap-2">
          {paymentStep === "confirm" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handlePaymentInitiation}
                disabled={isInitiatingPayment}
                className="min-w-[120px]"
              >
                {isInitiatingPayment ? (
                  <>
                    <ButtonSpinner />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${ride.price}
                  </>
                )}
              </Button>
            </>
          )}

          {paymentStep === "error" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => setPaymentStep("confirm")}>
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}