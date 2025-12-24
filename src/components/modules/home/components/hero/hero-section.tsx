import { Badge } from "@/components/ui/badge";
import { GradientBackground } from "@/components/ui/gradient-background";
import { HERO_MESSAGES, STATISTICS } from "@/constants/content.constant";
import { useHomeAnimations } from "../../hooks/use-home-animations";
import { CTAButtons } from "./c-t-a-buttons";
import { FloatingElements } from "./floating-elements";
import {
  badgeStyles,
  heroContainerStyles,
  subtitleStyles,
  titleStyles,
} from "./hero-styles";
import { StatsGrid } from "./stats-grid";

import type { HeroSectionProps } from "../../types";

export function HeroSection({ isAuthenticated = false }: HeroSectionProps) {
  const { badgeAnimation, titleAnimation, subtitleAnimation } =
    useHomeAnimations();

  return (
    <GradientBackground
      className={heroContainerStyles.base}
      role="banner"
      aria-labelledby="hero-heading"
    >
      <FloatingElements />

      <div className="max-w-7xl mx-auto relative z-10 py-10">
        <div className="text-center grid grid-cols-1 lg:grid-cols-2 items-center gap-x-4">
          <div>
            {/* Enhanced Badge with glass-morphism - Mobile Optimized */}
            <div
              ref={badgeAnimation.ref as React.RefObject<HTMLDivElement>}
              className={`${badgeStyles.responsive} transition-all duration-300 ${
                badgeAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Badge variant="secondary" className={badgeStyles.base}>
                ⭐
                <span className="hidden sm:inline">
                  Trusted by {STATISTICS.users} riders & drivers
                </span>
                <span className="sm:hidden">
                  {STATISTICS.users} trusted users
                </span>
              </Badge>
            </div>

            {/* Enhanced main heading with gradient text effects - Mobile Optimized */}
            <h1
              id="hero-heading"
              ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
              className={`${titleStyles.base} ${
                titleAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className={titleStyles.gradient}>Your Journey</span>
              <span className={`block ${titleStyles.span}`}>Starts Here</span>
            </h1>

            {/* Enhanced subtitle with micro-animations - Mobile Optimized */}
            <div
              ref={subtitleAnimation.ref as React.RefObject<HTMLDivElement>}
              className={`${subtitleStyles.container} ${
                subtitleAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className={subtitleStyles.base}>
                {HERO_MESSAGES.home.subtitle}
              </p>

              {/* Enhanced driver messaging with glass-morphism and animations - Mobile Optimized */}
              <div className={subtitleStyles.driverMessage}>
                <p className={subtitleStyles.driverText}>
                  <span className={subtitleStyles.driverHighlight}>
                    <span className="animate-bounce text-sm sm:text-base">
                      💰
                    </span>{" "}
                    For Drivers:
                  </span>{" "}
                  <span className={subtitleStyles.earnings}>
                    Earn $15-25/hour driving with Go Journy.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    Flexible schedule, instant payouts, and comprehensive
                    support. Join 2,500+ successful drivers already earning with
                    us.
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <StatsGrid />
            <CTAButtons isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
