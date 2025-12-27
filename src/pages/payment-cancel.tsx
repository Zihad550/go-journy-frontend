import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const [is_processing, set_is_processing] = useState(true);

  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Simulate processing the payment callback
    const processPaymentCallback = async () => {
      try {
        // Here you would typically validate the payment with your backend
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set_is_processing(false);
        toast.warning("Payment was cancelled.");
      } catch {
        set_is_processing(false);
      }
    };

    if (transactionId) {
      processPaymentCallback();
    } else {
      set_is_processing(false);
    }
  }, [transactionId]);

  if (is_processing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we process your payment...
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
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-yellow-600">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              You cancelled the payment process. Your ride booking is still
              active.
            </p>
            {transactionId && (
              <p className="text-sm text-muted-foreground">
                Transaction ID:{" "}
                <span className="font-mono">{transactionId}</span>
              </p>
            )}
            {amount && (
              <p className="text-sm text-muted-foreground">Amount: ${amount}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Payment Again
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              You can complete your payment anytime before your ride starts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentCancel;
