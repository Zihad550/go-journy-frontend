import {
  useScrollAnimation,
  useHoverAnimation,
} from "@/hooks/use-scroll-animation";

/**
 * Unified animation hook for Home module components
 * Consolidates all animation logic with predefined configurations
 */

interface AnimationConfig {
  animationType?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
  duration?: number;
  threshold?: number;
}

interface HoverConfig {
  scale?: number;
  duration?: number;
}

// Predefined animation configurations
const ANIMATION_PRESETS = {
  // Hero section animations
  hero: {
    badge: { animationType: "fade" as const, duration: 600, threshold: 0.2 },
    title: { animationType: "slideUp" as const, duration: 800, threshold: 0.1 },
    subtitle: {
      animationType: "slideUp" as const,
      duration: 600,
      threshold: 0.1,
    },
    stats: { animationType: "slideUp" as const, duration: 700, threshold: 0.2 },
    cta: { animationType: "slideUp" as const, duration: 500, threshold: 0.3 },
  },
  // CTA section animations
  cta: {
    header: { animationType: "fade" as const, duration: 800, threshold: 0.1 },
    container: {
      animationType: "slideUp" as const,
      duration: 600,
      threshold: 0.2,
    },
    stats: { animationType: "slideUp" as const, duration: 700, threshold: 0.3 },
  },
  // Section animations
  section: {
    header: { animationType: "fade" as const, duration: 800, threshold: 0.1 },
    tabs: { animationType: "slideUp" as const, duration: 600, threshold: 0.2 },
    content: {
      animationType: "slideUp" as const,
      duration: 600,
      threshold: 0.2,
    },
  },
  // General animations
  general: {
    card: { animationType: "slideUp" as const, duration: 600, threshold: 0.2 },
    button: { animationType: "scale" as const, duration: 300, threshold: 0.5 },
  },
} as const;

export function useHomeAnimations() {
  // Pre-computed animations - these are the main ones used by components
  const badgeAnimation = useScrollAnimation(ANIMATION_PRESETS.hero.badge);
  const titleAnimation = useScrollAnimation(ANIMATION_PRESETS.hero.title);
  const subtitleAnimation = useScrollAnimation(ANIMATION_PRESETS.hero.subtitle);
  const statsAnimation = useScrollAnimation(ANIMATION_PRESETS.hero.stats);
  const ctaAnimation = useScrollAnimation(ANIMATION_PRESETS.hero.cta);

  const headerAnimation = useScrollAnimation(ANIMATION_PRESETS.cta.header);
  const ctaContainerAnimation = useScrollAnimation(
    ANIMATION_PRESETS.cta.container,
  );
  const ctaStatsAnimation = useScrollAnimation(ANIMATION_PRESETS.cta.stats);

  const sectionHeaderAnimation = useScrollAnimation(
    ANIMATION_PRESETS.section.header,
  );
  const sectionTabsAnimation = useScrollAnimation(
    ANIMATION_PRESETS.section.tabs,
  );
  const sectionContentAnimation = useScrollAnimation(
    ANIMATION_PRESETS.section.content,
  );

  const cardAnimation = useScrollAnimation(ANIMATION_PRESETS.general.card);
  const buttonAnimation = useScrollAnimation(ANIMATION_PRESETS.general.button);

  const primaryButtonHover = useHoverAnimation({ scale: 1.05, duration: 200 });
  const secondaryButtonHover = useHoverAnimation({
    scale: 1.02,
    duration: 200,
  });
  const cardHover = useHoverAnimation({ scale: 1.02, duration: 300 });

  // Utility functions for custom animations (these don't call hooks)
  const getHeroAnimationConfig = (
    type: keyof typeof ANIMATION_PRESETS.hero,
    config?: Partial<AnimationConfig>,
  ) => {
    return { ...ANIMATION_PRESETS.hero[type], ...config };
  };

  const getCTAAnimationConfig = (
    type: keyof typeof ANIMATION_PRESETS.cta,
    config?: Partial<AnimationConfig>,
  ) => {
    return { ...ANIMATION_PRESETS.cta[type], ...config };
  };

  const getSectionAnimationConfig = (
    type: keyof typeof ANIMATION_PRESETS.section,
    config?: Partial<AnimationConfig>,
  ) => {
    return { ...ANIMATION_PRESETS.section[type], ...config };
  };

  const getGeneralAnimationConfig = (
    type: keyof typeof ANIMATION_PRESETS.general,
    config?: Partial<AnimationConfig>,
  ) => {
    return { ...ANIMATION_PRESETS.general[type], ...config };
  };

  const getHoverAnimationConfig = (config: HoverConfig = {}) => {
    const { scale = 1.05, duration = 200 } = config;
    return { scale, duration };
  };

  return {
    // Hero animations
    badgeAnimation,
    titleAnimation,
    subtitleAnimation,
    statsAnimation,
    ctaAnimation,

    // CTA animations
    headerAnimation,
    ctaContainerAnimation,
    ctaStatsAnimation,

    // Section animations
    sectionHeaderAnimation,
    sectionTabsAnimation,
    sectionContentAnimation,

    // General animations
    cardAnimation,
    buttonAnimation,

    // Hover animations
    primaryButtonHover,
    secondaryButtonHover,
    cardHover,

    // Utility functions for custom animations
    getHeroAnimationConfig,
    getCTAAnimationConfig,
    getSectionAnimationConfig,
    getGeneralAnimationConfig,
    getHoverAnimationConfig,
  };
}
