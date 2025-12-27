import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ButtonSpinner } from "@/components/ui/spinner";
import { PaymentModal } from "./payment-modal";
import { User, Car, Star, Clock } from "lucide-react";
import { useState } from "react";
import type { IRide, IDriver } from "@/types";

interface InterestedDriversProps {
  ride: IRide;
}

export function InterestedDrivers({ ride }: InterestedDriversProps) {
  const [payment_modal_open, set_payment_modal_open] = useState(false);
  const [selected_driver, set_selected_driver] = useState<
    string | IDriver | null
  >(null);

  const handleAcceptDriver = (driver: string | IDriver) => {
    set_selected_driver(driver);
    set_payment_modal_open(true);
  };

  const handleModalClose = () => {
    set_payment_modal_open(false);
    set_selected_driver(null);
  };

  const interestedDrivers = ride.interestedDrivers || [];

  if (interestedDrivers.length === 0) {
    return (
      <Card className="bg-muted/30 border border-border/50">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Interested Drivers Yet
          </h3>
          <p className="text-muted-foreground">
            Drivers will show interest in your ride request soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Interested Drivers ({interestedDrivers.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a driver to accept your ride request
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {interestedDrivers.map((driver) => (
              <DriverCard
                key={typeof driver === "string" ? driver : driver._id}
                driver={driver}
                onAccept={handleAcceptDriver}
                isLoading={false}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selected_driver && (
        <PaymentModal
          isOpen={payment_modal_open}
          onClose={handleModalClose}
          ride={ride}
          selectedDriver={selected_driver}
        />
      )}
    </>
  );
}

interface DriverCardProps {
  driver: string | IDriver;
  onAccept: (driverId: string) => void;
  isLoading: boolean;
}

function DriverCard({ driver, onAccept, isLoading }: DriverCardProps) {
  // Handle both string ID and populated driver object
  const driverId = typeof driver === "string" ? driver : driver._id;
  const driverName =
    typeof driver === "string"
      ? "Driver"
      : typeof driver.user === "string"
        ? driver.user
        : driver.user?.name || "Driver";
  const vehicleName =
    typeof driver === "string" ? "Vehicle" : driver.vehicle?.name || "Vehicle";
  const vehicleModel =
    typeof driver === "string" ? "" : driver.vehicle?.model || "";
  const experience = typeof driver === "string" ? 0 : driver.experience || 0;

  return (
    <Card className="border border-border/50 hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">{driverName}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="w-4 h-4" />
                <span>
                  {vehicleName} {vehicleModel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{experience} years experience</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Available
            </Badge>
            <Button
              onClick={() => onAccept(driverId)}
              disabled={isLoading}
              size="sm"
              className="min-w-[100px]"
            >
              {isLoading ? <ButtonSpinner /> : null}
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
