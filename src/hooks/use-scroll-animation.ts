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
  is_visible: boolean;
  has_animated: boolean;
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
    debounceMs = 16,
  } = options;

  const ref = useRef<T | null>(null);
  const [is_visible, set_is_visible] = useState(false);
  const [has_animated, set_has_animated] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const triggerAnimation = useCallback(() => {
    if (prefersReducedMotion.current) {
      set_is_visible(true);
      set_has_animated(true);
      return;
    }

    set_is_visible(true);
    if (triggerOnce) {
      set_has_animated(true);
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

    if (prefersReducedMotion.current) {
      set_is_visible(true);
      set_has_animated(true);
      return;
    }

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
            if (!has_animated || !triggerOnce) {
              debouncedTrigger();
            }
          } else if (!triggerOnce) {
            set_is_visible(false);
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
    has_animated,
    debouncedTrigger,
    animationType,
    duration,
    easing,
  ]);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion.current) return;

    if (is_visible) {
      const animatedStyles = getAnimatedStyles(animationType);
      Object.assign(element.style, animatedStyles);

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
  }, [is_visible, animationType, duration]);

  return {
    ref,
    is_visible,
    has_animated,
    triggerAnimation,
  };
};

function getInitialStyles(animationType: string): React.CSSProperties {
  switch (animationType) {
    case "fade":
      return {
        opacity: "0",
        transform: "translateZ(0)",
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.willChange = "transform, opacity";

    const cleanup = setTimeout(() => {
      element.style.willChange = "auto";
    }, duration + 100);

    return () => clearTimeout(cleanup);
  }, [duration, easing]);

  return ref;
};
