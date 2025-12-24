
import { cn } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/use-staggered-animation';
import { FeatureCard } from './feature-card';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  highlighted: boolean;
}

interface AnimatedFeatureGridProps {
  features: Feature[];
  enableAnimations?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  className?: string;
  gridClassName?: string;
}

/**
 * Animated grid component for feature cards with staggered entrance animations
 */
export function AnimatedFeatureGrid({
  features,
  enableAnimations = true,
  staggerDelay = 100,
  animationDuration = 300,
  className,
  gridClassName,
}: AnimatedFeatureGridProps) {
  const {
    getItemAnimationStyles,
    getItemAnimationClass,
    isItemVisible,
    isAnimating,
  } = useStaggeredAnimation({
    itemCount: features.length,
    staggerDelay,
    enabled: enableAnimations,
    animationDuration,
  });

  return (
    <div className={cn('space-y-6', className)}>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
          gridClassName
        )}
      >
        {features.map((feature, index) => (
          <div
            key={feature.id}
            style={getItemAnimationStyles(index)}
            className={cn(
              'transform-gpu', // Use GPU acceleration for better performance
              getItemAnimationClass(index),
              // Add subtle hover enhancement during animations
              isAnimating && !isItemVisible(index) && 'pointer-events-none'
            )}
          >
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              category={feature.category}
              highlighted={feature.highlighted}
              className={cn(
                // Enhanced animation support
                'transition-all duration-300 ease-out',
                // Subtle scale effect on hover when not animating
                !isAnimating && 'hover:scale-[1.02]',
                // Shadow enhancement during entrance
                isItemVisible(index) && 'shadow-sm hover:shadow-md'
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Export types for external use
export type { Feature, AnimatedFeatureGridProps };
