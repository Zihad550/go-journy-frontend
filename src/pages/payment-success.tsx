import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcceptDriverMutation } from "@/redux/features/ride/ride-api";
import { CheckCircle, Home, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [is_processing, set_is_processing] = useState(true);
  const [driver_accepted, set_driver_accepted] = useState(false);
  const [driver_info, set_driver_info] = useState<any>(null);
  const [acceptDriver] = useAcceptDriverMutation();

  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Check for pending driver acceptance
        const pendingDriverData = sessionStorage.getItem(
          "pendingDriverAcceptance",
        );

        if (pendingDriverData) {
          const driverData = JSON.parse(pendingDriverData);
          set_driver_info(driverData);

          // Accept the driver automatically
          try {
            await acceptDriver({
              rideId: driverData.rideId,
              driverId: driverData.driverId,
            }).unwrap();

            set_driver_accepted(true);
            toast.success("Driver accepted successfully! 🚗");
          } catch {
            toast.error(
              "Payment successful, but failed to accept driver. Please contact support.",
            );
          }

          // Clear the pending data
          sessionStorage.removeItem("pendingDriverAcceptance");
        }

        // Here you would typically validate the payment with your backend
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set_is_processing(false);
        toast.success("Payment processed successfully!");
      } catch {
        toast.error("There was an issue processing your payment.");
        set_is_processing(false);
      }
    };

    if (transactionId) {
      processPaymentCallback();
    } else {
      set_is_processing(false);
    }
  }, [transactionId, acceptDriver]);

  if (is_processing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
            </p>
            {driver_accepted && driver_info && (
              <div className="bg-primary/5 rounded-lg p-3 mt-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    Driver {driver_info.driverName} has been accepted!
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your ride is now confirmed and will begin shortly.
                </p>
              </div>
            )}
            {transactionId && (
              <p className="text-sm text-muted-foreground">
                Transaction ID:{" "}
                <span className="font-mono">{transactionId}</span>
              </p>
            )}
            {amount && (
              <p className="text-lg font-semibold">Amount Paid: ${amount}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              A confirmation email with your invoice has been sent to your email
              address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccess;
