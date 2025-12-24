import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useHomeAnimations } from "../../hooks/use-home-animations";
import { animationClasses } from "@/lib/animations";

import type { CTAButtonsProps } from "../../types";

export function CTAButtons({
  isAuthenticated = false,
  className = "",
}: CTAButtonsProps) {
  const { ctaAnimation: cta_animation, primaryButtonHover: primary_button_hover, secondaryButtonHover: secondary_button_hover } =
    useHomeAnimations();

  return (
    <div
      ref={cta_animation.ref as React.RefObject<HTMLDivElement>}
      className={`space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-0 transition-all duration-500 ${
        cta_animation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {/* Primary CTA for riders - Enhanced with micro-animations and Mobile Optimized */}
      <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
        <Button
          ref={primary_button_hover as React.RefObject<HTMLButtonElement>}
          size="lg"
          className={`group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 min-h-[44px] sm:min-h-[48px] md:min-h-[56px] bg-gradient-to-r from-primary to-chart-1 hover:from-chart-1 hover:to-primary relative overflow-hidden touch-manipulation ${animationClasses.hoverGlow}`}
          asChild
        >
          <Link to="/register">
            <span className="relative z-10">Book Your Ride</span>
            <ArrowRight
              className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10"
              aria-hidden="true"
            />
            {/* Animated background effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-chart-3/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            ></div>
          </Link>
        </Button>

        {!isAuthenticated && (
          <Button
            ref={secondary_button_hover as React.RefObject<HTMLButtonElement>}
            variant="outline"
            size="lg"
            className={`group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-semibold border-2 border-primary/50 backdrop-blur-sm bg-card/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 min-h-[44px] sm:min-h-[48px] md:min-h-[56px] hover:shadow-lg hover:-translate-y-1 relative overflow-hidden touch-manipulation ${animationClasses.hoverLift}`}
            asChild
          >
            <Link to="/login">
              <span className="relative z-10">Sign In</span>
              {/* Subtle shine effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                aria-hidden="true"
              ></div>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
