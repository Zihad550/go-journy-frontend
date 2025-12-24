import { Switch } from "@/components/ui/switch";
import { DriverAvailability } from "@/constants/driver-constant";
import { useUpdateDriverAvailabilityMutation } from "@/redux/features/driver/driver-api";
import { useState } from "react";
import { toast } from "sonner";

interface DriverAvailabilityControlProps {
  currentAvailability: string;
  driverId?: string; // Optional for now, may be used for future features
}

export function DriverAvailabilityControl({
  currentAvailability,
}: DriverAvailabilityControlProps) {
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
    <div className="flex items-center gap-2">
      <Switch
        checked={isOnline}
        onCheckedChange={handleAvailabilityChange}
        disabled={isLoading}
        aria-label={`Driver availability: ${isOnline ? "online" : "offline"}`}
      />
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium ${
            isOnline ? "text-chart-1" : "text-muted-foreground"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
        {isLoading && (
          <span className="text-xs text-muted-foreground">(updating...)</span>
        )}
      </div>
    </div>
  );
}
