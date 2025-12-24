import { useScrollAnimation, useHoverAnimation } from "./use-scroll-animation";

/**
 * Custom hook for CTA section animations
 * Provides predefined animation configurations for consistent behavior
 */
export const useCTAAnimations = () => {
  // Header section animation
  const headerAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "fade",
    duration: 800,
    threshold: 0.1,
  });

  // Main CTA container animation
  const ctaAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "slideUp",
    duration: 600,
    threshold: 0.2,
  });

  // Statistics grid animation
  const statsAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "slideUp",
    duration: 700,
    threshold: 0.3,
  });

  // Primary button hover animation
  const primaryButtonHover = useHoverAnimation<HTMLButtonElement>({
    scale: 1.05,
    duration: 200
  });

  return {
    headerAnimation,
    ctaAnimation,
    statsAnimation,
    primaryButtonHover,
  };
};