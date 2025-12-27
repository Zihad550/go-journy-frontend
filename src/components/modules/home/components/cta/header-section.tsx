import { Badge } from "@/components/ui/badge";
import { STATISTICS } from "@/constants/content-constant";
import { useHomeAnimations } from "../../hooks/use-home-animations";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { StatisticsData } from "../../types";

// Type assertion for STATISTICS
const stats = STATISTICS as StatisticsData;

export function HeaderSection() {
  const { headerAnimation, ctaStatsAnimation } = useHomeAnimations();
  return (
    <div
      ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "text-center mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0 transition-all duration-800",
        headerAnimation.is_visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
      )}
    >
      <Badge
        variant="secondary"
        className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-primary/10 text-primary border-primary/20"
      >
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Join the Movement
      </Badge>

      <h2
        id="cta-heading"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6"
      >
        <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
          Ready to Transform
        </span>
        <br />
        Your Journey?
      </h2>

      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
        Join thousands of satisfied users who've already discovered the future
        of transportation
      </p>

      {/* Social Proof Statistics - Mobile Optimized */}
      <div
        ref={ctaStatsAnimation.ref as React.RefObject<HTMLDivElement>}
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 transition-all duration-700",
          ctaStatsAnimation.is_visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8",
        )}
        role="list"
        aria-label="Platform statistics and achievements"
      >
        <div
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
          role="listitem"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
            {stats.users}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Happy Users
          </div>
        </div>
        <div
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
          role="listitem"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-chart-1 mb-1">
            {stats.rides}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Rides Completed
          </div>
        </div>
        <div
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
          role="listitem"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-chart-2 mb-1">
            {stats.rating}★
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Average Rating
          </div>
        </div>
        <div
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
          role="listitem"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-chart-3 mb-1">
            {stats.cities}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Cities Served
          </div>
        </div>
      </div>
    </div>
  );
}
