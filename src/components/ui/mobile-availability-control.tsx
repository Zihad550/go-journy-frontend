import { Switch } from "@/components/ui/switch";
import { DriverAvailability } from "@/constants/driver-constant";
import { useUpdateDriverAvailabilityMutation } from "@/redux/features/driver/driver-api";
import { useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

interface MobileAvailabilityControlProps {
  currentAvailability: string;
  driverId?: string;
}

export function MobileAvailabilityControl({
  currentAvailability,
}: MobileAvailabilityControlProps) {
  const [updateAvailability, { isLoading }] =
    useUpdateDriverAvailabilityMutation();
  const [localAvailability, setLocalAvailability] =
    useState(currentAvailability);

  const isOnline = localAvailability === DriverAvailability.ONLINE;

  const handleAvailabilityChange = async (checked: boolean) => {
    const newAvailability = checked
      ? DriverAvailability.ONLINE
      : DriverAvailability.OFFLINE;

    // Optimistic update
    setLocalAvailability(newAvailability);

    try {
      await updateAvailability({
        availability: newAvailability,
      }).unwrap();

      toast.success(
        `You are now ${checked ? "online" : "offline"} and ${
          checked ? "available" : "unavailable"
        } for ride requests`,
        {
          icon: checked ? "🟢" : "🔴",
        },
      );
    } catch (error) {
      // Revert optimistic update on error
      setLocalAvailability(currentAvailability);

      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String(error.data.message)
          : "Failed to update availability status";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-2 rounded-md bg-muted/30 border">
      <div className="flex items-center gap-3">
        <div className="relative">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              {isOnline ? (
                <Wifi className="h-4 w-4 text-chart-1" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              )}
              {isOnline && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-chart-1 rounded-full animate-ping" />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium">Driver Status</span>
          <span
            className={`text-xs ${
              isOnline ? "text-chart-1" : "text-muted-foreground"
            }`}
          >
            {isLoading
              ? "Updating..."
              : isOnline
                ? "Available for rides"
                : "Not available"}
          </span>
        </div>
      </div>

      <Switch
        checked={isOnline}
        onCheckedChange={handleAvailabilityChange}
        disabled={isLoading}
        aria-label={`Driver availability: ${isOnline ? "online" : "offline"}`}
        className="data-[state=checked]:bg-chart-1"
      />
    </div>
  );
}
