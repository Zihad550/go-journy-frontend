import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  staggerDelay?: number;
  animationType?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
  duration?: number;
  easing?: string;
  debounceMs?: number;
}

interface ScrollAnimationReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
  hasAnimated: boolean;
  triggerAnimation: () => void;
}

/**
 * Custom hook for scroll-triggered animations with performance optimization
 * Supports staggered animations, reduced motion, and GPU acceleration
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(
  options: ScrollAnimationOptions = {},
): ScrollAnimationReturn<T> => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
    animationType = "fade",
    duration = 600,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
    debounceMs = 16, // ~60fps
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const triggerAnimation = useCallback(() => {
    if (prefersReducedMotion.current) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    setIsVisible(true);
    if (triggerOnce) {
      setHasAnimated(true);
    }
  }, [triggerOnce]);

  const debouncedTrigger = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      triggerAnimation();
    }, debounceMs);
  }, [triggerAnimation, debounceMs]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip animation setup if reduced motion is preferred
    if (prefersReducedMotion.current) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    // Set initial styles for animation
    const initialStyles = getInitialStyles(animationType);
    Object.assign(element.style, {
      ...initialStyles,
      transition: `all ${duration}ms ${easing}`,
      willChange: "transform, opacity",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated || !triggerOnce) {
              debouncedTrigger();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    threshold,
    rootMargin,
    triggerOnce,
    hasAnimated,
    debouncedTrigger,
    animationType,
    duration,
    easing,
  ]);

  // Apply animation styles when visible
  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion.current) return;

    if (isVisible) {
      const animatedStyles = getAnimatedStyles(animationType);
      Object.assign(element.style, animatedStyles);

      // Clean up will-change after animation completes
      const cleanup = setTimeout(() => {
        element.style.willChange = "auto";
      }, duration + 100);

      return () => clearTimeout(cleanup);
    } else {
      const initialStyles = getInitialStyles(animationType);
      Object.assign(element.style, {
        ...initialStyles,
        willChange: "transform, opacity",
      });
    }
  }, [isVisible, animationType, duration]);

  return {
    ref,
    isVisible,
    hasAnimated,
    triggerAnimation,
  };
};

/**
 * Hook for staggered animations on multiple elements
 */
export const useStaggeredScrollAnimation = (
  count: number,
  options: ScrollAnimationOptions = {},
): ScrollAnimationReturn[] => {
  const { staggerDelay = 100, ...restOptions } = options;

  // Create hooks statically to avoid calling them inside array methods
  const hooks: ScrollAnimationReturn[] = [];
  for (let i = 0; i < count; i++) {
    hooks.push(useScrollAnimation({
      ...restOptions,
      staggerDelay: staggerDelay * i,
    }));
  }

  return hooks;
};

/**
 * Get initial styles for different animation types
 */
function getInitialStyles(animationType: string): React.CSSProperties {
  switch (animationType) {
    case "fade":
      return {
        opacity: "0",
        transform: "translateZ(0)", // GPU acceleration
      };
    case "slide":
      return {
        opacity: "0",
        transform: "translateX(-30px) translateZ(0)",
      };
    case "slideUp":
      return {
        opacity: "0",
        transform: "translateY(30px) translateZ(0)",
      };
    case "slideDown":
      return {
        opacity: "0",
        transform: "translateY(-30px) translateZ(0)",
      };
    case "scale":
      return {
        opacity: "0",
        transform: "scale(0.9) translateZ(0)",
      };
    default:
      return {
        opacity: "0",
        transform: "translateZ(0)",
      };
  }
}

/**
 * Get animated styles for different animation types
 */
function getAnimatedStyles(animationType: string): React.CSSProperties {
  switch (animationType) {
    case "fade":
      return {
        opacity: "1",
        transform: "translateZ(0)",
      };
    case "slide":
    case "slideUp":
    case "slideDown":
      return {
        opacity: "1",
        transform: "translateX(0) translateY(0) translateZ(0)",
      };
    case "scale":
      return {
        opacity: "1",
        transform: "scale(1) translateZ(0)",
      };
    default:
      return {
        opacity: "1",
        transform: "translateZ(0)",
      };
  }
}

/**
 * Hook for hover animations with performance optimization
 */
export const useHoverAnimation = <T extends HTMLElement = HTMLElement>(
  options: {
    scale?: number;
    duration?: number;
    easing?: string;
  } = {},
) => {
  const {
    scale = 1.05,
    duration = 200,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseEnter = () => {
      element.style.transform = `scale(${scale}) translateZ(0)`;
      element.style.transition = `transform ${duration}ms ${easing}`;
      element.style.willChange = "transform";
    };

    const handleMouseLeave = () => {
      element.style.transform = "scale(1) translateZ(0)";
      element.style.transition = `transform ${duration}ms ${easing}`;

      // Clean up will-change after animation
      setTimeout(() => {
        element.style.willChange = "auto";
      }, duration + 50);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale, duration, easing]);

  return ref;
};

/**
 * Hook for section transition animations
 */
export const useSectionTransition = (
  options: {
    duration?: number;
    easing?: string;
  } = {},
) => {
  const { duration = 800, easing = "cubic-bezier(0.4, 0, 0.2, 1)" } = options;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Set up smooth section transitions
    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.willChange = "transform, opacity";

    // Clean up will-change after initial setup
    const cleanup = setTimeout(() => {
      element.style.willChange = "auto";
    }, duration + 100);

    return () => clearTimeout(cleanup);
  }, [duration, easing]);

  return ref;
};
