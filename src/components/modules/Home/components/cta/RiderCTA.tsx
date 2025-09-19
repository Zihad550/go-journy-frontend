import { Button } from "@/components/ui/button";
import { STATISTICS } from "@/constants/content.constant";
import { useHomeAnimations } from '../../hooks/useHomeAnimations';
import { animationClasses } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { AnimatedIcon } from "../shared/AnimatedIcon";
import { UrgencyBadge } from "../shared/UrgencyBadge";
import { BenefitGrid } from "../shared/BenefitGrid";
import type { StatisticsData } from "../../types";

// Type assertion for STATISTICS
const stats = STATISTICS as StatisticsData;

export function RiderCTA() {
  const { primaryButtonHover } = useHomeAnimations();

  return (
    <div
      className={cn(
        "group relative bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500",
        animationClasses.hoverLift,
      )}
    >
      {/* Urgency indicator */}
      <UrgencyBadge
        icon={<Zap className="w-3 h-3 mr-1" />}
        text="Limited Time Offer"
        variant="primary"
      />

      <div className="text-center">
        {/* Animated Icon */}
        <AnimatedIcon
          icon={<Users />}
          size="md"
          color="text-primary"
          bgColor="bg-gradient-to-br from-primary/20 to-primary/10"
          className="mb-4 sm:mb-6"
        />

        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
          Need a Ride?
        </h3>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-muted-foreground leading-relaxed">
          Book your ride in seconds. Safe, reliable, and affordable
          transportation with professional drivers ready to take you
          anywhere.
        </p>

        {/* Enhanced Benefits */}
        <BenefitGrid
          items={[
            { icon: <Clock />, text: `${stats.waitTime} avg wait` },
            { icon: <Star />, text: `${stats.rating}★ rated` },
            { icon: <Shield />, text: `${stats.safetyRecord} safe` },
            { icon: <MapPin />, text: "Real-time tracking" },
          ]}
          className="mb-4 sm:mb-6"
          itemClassName="bg-muted/30 rounded-lg p-2"
        />

        {/* Social proof - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <CheckCircle
              className="w-3 h-3 sm:w-4 sm:h-4 inline text-primary mr-1"
              aria-hidden="true"
            />
            Join{" "}
            <span className="font-semibold text-primary">
              {stats.users}
            </span>{" "}
            satisfied riders
          </p>
        </div>

        <Button
          ref={primaryButtonHover as React.RefObject<HTMLButtonElement>}
          size="lg"
          className={cn(
            "w-full px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-300 min-h-[48px] sm:min-h-[56px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group-hover:animate-pulse touch-manipulation",
            animationClasses.hoverGlow,
          )}
          asChild
        >
          <Link to="/register">
            <span className="hidden sm:inline">
              Book Your First Ride 10% off
            </span>
            <span className="sm:hidden">Book First Ride 10% off</span>
            <ArrowRight
              className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground mt-2">
          🎉 First ride up to $10 off for new users
        </p>
      </div>
    </div>
  );
}