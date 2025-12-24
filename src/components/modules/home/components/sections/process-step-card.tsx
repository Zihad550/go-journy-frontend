import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import {
  useScrollAnimation,
  useHoverAnimation,
} from "@/hooks/use-scroll-animation";
import { animationClasses } from "@/lib/animations";
import { ANIMATION_CONFIG } from "../../constants/how-it-works-section-constants";
import type { ProcessStep } from "@/constants/how-it-works.constant";

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  isLast: boolean;
}

function ProcessStepCardComponent({
  step,
  index,
  isLast,
}: ProcessStepCardProps) {
  const Icon = step.icon;

  // Animation for each step card
  const step_animation = useScrollAnimation<HTMLDivElement>({
    animationType: "slideUp",
    duration: ANIMATION_CONFIG.stepCard.duration,
    threshold: ANIMATION_CONFIG.stepCard.threshold,
    staggerDelay: index * ANIMATION_CONFIG.stepCard.staggerDelay,
  });

  const card_hover = useHoverAnimation<HTMLDivElement>({
    scale: ANIMATION_CONFIG.hover.scale,
    duration: ANIMATION_CONFIG.hover.duration,
  });

  return (
    <div
      ref={step_animation.ref}
      className={cn(
        "relative flex flex-col items-center transition-all duration-600",
        step_animation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
      )}
    >
      {/* Step Number and Icon - Enhanced Mobile */}
      <div className="relative z-10 mb-4 sm:mb-6">
        {/* Step Number Circle - Responsive */}
        <div className="absolute -top-1.5 sm:-top-2 -left-1.5 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-lg">
          {step.step}
        </div>

        {/* Icon Container with Glass-morphism - Responsive */}
        <div
          className={cn(
            "w-12 h-12 sm:w-16 sm:h-16 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300",
            animationClasses.hoverScale,
          )}
          aria-hidden="true"
        >
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
      </div>

      {/* Connecting Line - Desktop Only */}
      {!isLast && (
        <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-16 sm:h-24 bg-gradient-to-b from-primary/50 to-primary/20 hidden md:block">
          {/* Animated Progress Indicator */}
          <div className="w-full h-full bg-gradient-to-b from-primary to-primary/60 animate-pulse" />
        </div>
      )}

      {/* Mobile Connecting Arrow */}
      {!isLast && (
        <div
          className="md:hidden absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-primary/40"
          aria-hidden="true"
        >
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>
      )}

      {/* Content Card - Enhanced Mobile */}
      <Card
        ref={card_hover}
        className={cn(
          "w-full max-w-xs sm:max-w-sm bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300",
          animationClasses.hoverLift,
        )}
      >
        <CardContent className="p-4 sm:p-6 text-center">
          <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
            {step.title}
          </h4>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const ProcessStepCard = memo(ProcessStepCardComponent);
