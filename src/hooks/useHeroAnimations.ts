import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimationConfig {
  animationType: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';
  duration: number;
  threshold: number;
}

interface HeroAnimationsConfig {
  badge?: AnimationConfig;
  title?: AnimationConfig;
  subtitle?: AnimationConfig;
  stats?: AnimationConfig;
  cta?: AnimationConfig;
}

const defaultConfigs: Required<HeroAnimationsConfig> = {
  badge: {
    animationType: 'fade',
    duration: 600,
    threshold: 0.2,
  },
  title: {
    animationType: 'slideUp',
    duration: 800,
    threshold: 0.1,
  },
  subtitle: {
    animationType: 'slideUp',
    duration: 600,
    threshold: 0.1,
  },
  stats: {
    animationType: 'slideUp',
    duration: 700,
    threshold: 0.2,
  },
  cta: {
    animationType: 'slideUp',
    duration: 500,
    threshold: 0.3,
  },
};

export function useHeroAnimations(config: Partial<HeroAnimationsConfig> = {}) {
  const finalConfig = { ...defaultConfigs, ...config };

  const badgeAnimation = useScrollAnimation(finalConfig.badge);
  const titleAnimation = useScrollAnimation(finalConfig.title);
  const subtitleAnimation = useScrollAnimation(finalConfig.subtitle);
  const statsAnimation = useScrollAnimation(finalConfig.stats);
  const ctaAnimation = useScrollAnimation(finalConfig.cta);

  return {
    badgeAnimation,
    titleAnimation,
    subtitleAnimation,
    statsAnimation,
    ctaAnimation,
  };
}