import { Button } from "@/components/ui/button";
import { RideStatus } from "@/constants";
import { cn } from "@/lib/utils";
import type { ObjectValues } from "@/types";
import { Car, CheckCircle, Clock, Loader2, Star } from "lucide-react";

interface RideStatusCardProps {
  status: ObjectValues<typeof RideStatus>;
  className?: string;
}

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBg: string;
  showLoader?: boolean;
  showPulse?: boolean;
  actionButton?: React.ReactNode;
}

export function RideStatusCard({ status, className }: RideStatusCardProps) {
  const getStatusConfig = (
    status: ObjectValues<typeof RideStatus>,
  ): StatusConfig => {
    switch (status) {
      case "requested":
        return {
          icon: <Clock className="h-7 w-7 text-primary-foreground" />,
          title: "🔍 Requesting for a Driver",
          description:
            "We're requesting for available drivers in your area. This usually takes 2-5 minutes. Hang tight while we find the perfect match for your journey!",
          bgColor: "bg-muted/50",
          iconBg: "bg-chart-4",
          showLoader: true,
          showPulse: true,
        };
      case "accepted":
        return {
          icon: <CheckCircle className="h-7 w-7 text-primary-foreground" />,
          title: "🎉 Driver Found!",
          description:
            "Great news! A driver has accepted your ride and is on their way to pick you up. You'll receive updates as they approach your location.",
          bgColor: "bg-muted/50",
          iconBg: "bg-primary",
          showLoader: false,
          showPulse: false,
        };
      case "in_transit":
        return {
          icon: <Car className="h-7 w-7 text-primary-foreground" />,
          title: "🚗 Ride in Progress",
          description:
            "You're on your way! Sit back, relax, and enjoy your journey. Your driver will safely get you to your destination.",
          bgColor: "bg-muted/50",
          iconBg: "bg-chart-2",
          showLoader: false,
          showPulse: true,
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-7 w-7 text-primary-foreground" />,
          title: "✅ Ride Completed",
          description:
            "Hope you had a great journey! Your ride has been completed successfully.",
          bgColor: "bg-muted/50",
          iconBg: "bg-chart-1",
          showLoader: false,
          showPulse: false,
          actionButton: (
            <Button
              variant="outline"
              size="sm"
              className="text-chart-1 border-chart-1 hover:bg-chart-1/10"
            >
              <Star className="h-4 w-4 mr-2" />
              Rate Your Driver
            </Button>
          ),
        };
      case "cancelled":
        return {
          icon: <CheckCircle className="h-7 w-7 text-primary-foreground" />,
          title: "❌ Ride Cancelled",
          description: "Your ride has been cancelled successfully.",
          bgColor: "bg-muted/50",
          iconBg: "bg-destructive",
          showLoader: false,
          showPulse: false,
        };
      default:
        return {
          icon: <Clock className="h-7 w-7 text-primary-foreground" />,
          title: "Unknown Status",
          description: "Ride status is not recognized.",
          bgColor: "bg-muted/50",
          iconBg: "bg-muted",
          showLoader: false,
          showPulse: false,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={cn(
        "relative overflow-hidden border rounded-2xl p-8 backdrop-blur-sm",
        config.bgColor,
        className,
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "p-3 rounded-2xl shadow-lg",
            config.iconBg,
            config.showPulse && "animate-pulse",
          )}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-3">{config.title}</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {config.description}
          </p>

          {config.showLoader && (
            <div className="flex items-center gap-2 text-chart-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Searching...</span>
            </div>
          )}

          {config.actionButton && config.actionButton}
        </div>
      </div>
    </div>
  );
}
