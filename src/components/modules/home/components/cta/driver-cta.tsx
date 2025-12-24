import { Button } from "@/components/ui/button";
import { STATISTICS } from "@/constants/content-constant";
import { animationClasses } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { AnimatedIcon } from "../shared/animated-icon";
import { UrgencyBadge } from "../shared/urgency-badge";
import { BenefitGrid } from "../shared/benefit-grid";
import type { DriverCTAProps, StatisticsData } from "../../types";

// Type assertion for STATISTICS
const stats = STATISTICS as StatisticsData;

export function DriverCTA({ isAuthenticated }: DriverCTAProps) {
  return (
    <div
      className={cn(
        "group relative bg-gradient-to-br from-chart-2/10 to-chart-1/10 backdrop-blur-md border border-chart-2/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500",
        animationClasses.hoverLift,
      )}
    >
      {/* Urgency indicator */}
      <UrgencyBadge
        icon={<TrendingUp className="w-3 h-3 mr-1" />}
        text="High Demand Area"
        variant="chart2"
      />

      <div className="text-center">
        {/* Animated Icon */}
        <AnimatedIcon
          icon={<Car />}
          size="md"
          color="text-chart-2"
          bgColor="bg-gradient-to-br from-chart-2/20 to-chart-2/10"
          className="mb-6"
        />

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Start Earning Today
        </h3>
        <p className="text-lg sm:text-xl mb-6 text-muted-foreground leading-relaxed">
          Turn your car into income. Drive when you want, earn competitive
          rates, and join thousands of successful drivers on our platform.
        </p>

        {/* Enhanced Benefits */}
        <BenefitGrid
          items={[
            { icon: <DollarSign />, text: "Up to $25/hour" },
            { icon: <Clock />, text: "Flexible schedule" },
            { icon: <TrendingUp />, text: "Weekly bonuses" },
            { icon: <Zap />, text: "Instant payouts" },
          ]}
          className="mb-6 text-sm"
          itemClassName="bg-chart-2/10 rounded-lg p-2"
        />

        {/* Social proof */}
        <div className="mb-6 p-3 bg-chart-2/5 rounded-lg border border-chart-2/20">
          <p className="text-sm text-muted-foreground">
            <CheckCircle
              className="w-4 h-4 inline text-chart-2 mr-1"
              aria-hidden="true"
            />
            <span className="font-semibold text-chart-2">
              {stats.drivers}
            </span>{" "}
            drivers earned{" "}
            <span className="font-semibold text-chart-2">
              {stats.earnings}
            </span>{" "}
            total
          </p>
        </div>

        <Button
          size="lg"
          className="w-full px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 min-h-[56px] bg-gradient-to-r from-chart-2 to-chart-2/90 hover:from-chart-2/90 hover:to-chart-2 text-white group-hover:animate-pulse"
          asChild
        >
          <Link to={isAuthenticated ? "/driver-registration" : "/login"}>
            <DollarSign
              className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            Start Driving & Earning
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground mt-2">
          💰 $200 sign-up bonus for qualified drivers
        </p>
      </div>
    </div>
  );
}