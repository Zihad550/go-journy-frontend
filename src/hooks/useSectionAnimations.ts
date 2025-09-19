import { useScrollAnimation } from './useScrollAnimation';
import { ANIMATION_CONFIG } from '@/components/modules/Home/constants/howItWorksSection.constants';

export function useSectionAnimations() {
  const headerAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: 'fade',
    duration: ANIMATION_CONFIG.header.duration,
    threshold: ANIMATION_CONFIG.header.threshold,
  });

  const tabsAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: 'slideUp',
    duration: ANIMATION_CONFIG.tabs.duration,
    threshold: ANIMATION_CONFIG.tabs.threshold,
  });

  return {
    headerAnimation,
    tabsAnimation,
  };
}