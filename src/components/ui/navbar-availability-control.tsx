import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DriverAvailability } from "@/constants/driver-constant";
import { useUpdateDriverAvailabilityMutation } from "@/redux/features/driver/driver-api";
import { useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

interface NavbarAvailabilityControlProps {
  currentAvailability: string;
  driverId?: string;
}

export function NavbarAvailabilityControl({
  currentAvailability,
}: NavbarAvailabilityControlProps) {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border bg-background/50 backdrop-blur-sm transition-all duration-200 hover:bg-background/80 hover:shadow-md cursor-pointer">
            <Switch
              checked={isOnline}
              onCheckedChange={handleAvailabilityChange}
              disabled={isLoading}
              aria-label={`Driver availability: ${
                isOnline ? "online" : "offline"
              }`}
              className="scale-90 data-[state=checked]:bg-chart-1"
            />

            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <div className="relative">
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-chart-1" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-muted-foreground" />
                  )}
                  {isOnline && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-chart-1 rounded-full animate-ping" />
                  )}
                </div>
              )}

              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={`text-xs font-medium px-2 py-0.5 transition-all duration-200 ${
                  isOnline
                    ? "bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20"
                    : "bg-muted/50 text-muted-foreground border-muted/30"
                }`}
              >
                {isLoading ? "Updating..." : isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-center">
            <p className="font-medium">
              {isOnline ? "You are online" : "You are offline"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline
                ? "Riders can see and request rides from you"
                : "You won't receive new ride requests"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
