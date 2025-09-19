/**
 * Animation utilities for consistent animations across the application
 * Includes GPU acceleration, reduced motion support, and performance optimization
 */

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
}

export interface StaggerConfig {
  delay: number;
  increment: number;
  maxDelay?: number;
}

/**
 * Animation presets for consistent timing and easing
 */
export const animationPresets = {
  fast: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  normal: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slow: {
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  smooth: {
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
} as const;

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Create staggered delay for multiple elements
 */
export const createStaggerDelay = (
  index: number,
  config: StaggerConfig
): number => {
  const { delay, increment, maxDelay } = config;
  const calculatedDelay = delay + index * increment;
  return maxDelay ? Math.min(calculatedDelay, maxDelay) : calculatedDelay;
};

/**
 * Apply GPU acceleration to an element
 */
export const enableGPUAcceleration = (element: HTMLElement): void => {
  element.style.transform = element.style.transform || 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
};

/**
 * Clean up GPU acceleration after animation
 */
export const cleanupGPUAcceleration = (
  element: HTMLElement,
  delay = 100
): void => {
  setTimeout(() => {
    element.style.willChange = 'auto';
  }, delay);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Animation classes for CSS-based animations
 */
export const animationClasses = {
  // Entrance animations
  fadeIn: 'animate-in fade-in duration-500',
  slideInUp: 'animate-in slide-in-from-bottom-4 duration-500',
  slideInDown: 'animate-in slide-in-from-top-4 duration-500',
  slideInLeft: 'animate-in slide-in-from-left-4 duration-500',
  slideInRight: 'animate-in slide-in-from-right-4 duration-500',
  scaleIn: 'animate-in zoom-in-95 duration-500',

  // Exit animations
  fadeOut: 'animate-out fade-out duration-300',
  slideOutUp: 'animate-out slide-out-to-top-4 duration-300',
  slideOutDown: 'animate-out slide-out-to-bottom-4 duration-300',
  slideOutLeft: 'animate-out slide-out-to-left-4 duration-300',
  slideOutRight: 'animate-out slide-out-to-right-4 duration-300',
  scaleOut: 'animate-out zoom-out-95 duration-300',

  // Hover animations
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  hoverGlow:
    'transition-all duration-200 hover:shadow-xl hover:shadow-primary/25',

  // Loading animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',

  // Stagger delays
  delay75: 'delay-75',
  delay100: 'delay-100',
  delay150: 'delay-150',
  delay200: 'delay-200',
  delay300: 'delay-300',
  delay500: 'delay-500',
  delay700: 'delay-700',
  delay1000: 'delay-1000',
} as const;

/**
 * Create CSS custom properties for dynamic animations
 */
export const createAnimationVars = (
  config: AnimationConfig
): React.CSSProperties => {
  return {
    '--animation-duration': `${config.duration}ms`,
    '--animation-easing': config.easing,
    '--animation-delay': config.delay ? `${config.delay}ms` : '0ms',
  } as React.CSSProperties;
};

/**
 * Intersection Observer options for different animation triggers
 */
export const observerOptions = {
  // Trigger when element is 10% visible
  early: {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
  },
  // Trigger when element is 50% visible
  center: {
    threshold: 0.5,
    rootMargin: '0px',
  },
  // Trigger when element is fully visible
  full: {
    threshold: 1.0,
    rootMargin: '0px',
  },
  // Trigger before element enters viewport
  preload: {
    threshold: 0,
    rootMargin: '50px 0px 50px 0px',
  },
} as const;

/**
 * Performance monitoring for animations
 */
export const measureAnimationPerformance = (
  name: string,
  callback: () => void
): void => {
  if (typeof window === 'undefined' || !window.performance) {
    callback();
    return;
  }

  const startTime = performance.now();
  callback();

  requestAnimationFrame(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log performance if animation takes too long
    if (duration > 16.67) {
      // More than one frame at 60fps
      console.warn(`Animation "${name}" took ${duration.toFixed(2)}ms`);
    }
  });
};

/**
 * Create a spring animation configuration
 */
export const createSpringConfig = (
  tension = 300,
  friction = 30
): AnimationConfig => {
  // Convert spring physics to CSS timing
  const duration = Math.sqrt(tension / friction) * 100;
  const damping = friction / (2 * Math.sqrt(tension));

  let easing: string;
  if (damping < 1) {
    // Underdamped (bouncy)
    easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  } else if (damping === 1) {
    // Critically damped
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  } else {
    // Overdamped
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }

  return {
    duration: Math.max(200, Math.min(1000, duration)),
    easing,
  };
};
