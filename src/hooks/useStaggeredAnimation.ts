import { useEffect, useState } from 'react';

interface UseStaggeredAnimationOptions {
  itemCount: number;
  staggerDelay: number;
  enabled: boolean;
  animationDuration: number;
}

interface StaggeredAnimationState {
  visibleItems: Set<number>;
  isAnimating: boolean;
  currentIndex: number;
}

/**
 * Hook for managing staggered animations of list items
 * Provides progressive reveal of items with configurable delays
 */
export function useStaggeredAnimation({
  itemCount,
  staggerDelay,
  enabled,
  animationDuration,
}: UseStaggeredAnimationOptions) {
  const [state, setState] = useState<StaggeredAnimationState>({
    visibleItems: new Set(),
    isAnimating: false,
    currentIndex: 0,
  });

  // Reset and start animation when parameters change
  useEffect(() => {
    if (!enabled || itemCount === 0) {
      // Show all items immediately if animations disabled
      setState({
        visibleItems: new Set(Array.from({ length: itemCount }, (_, i) => i)),
        isAnimating: false,
        currentIndex: itemCount,
      });
      return;
    }

    // Reset state
    setState({
      visibleItems: new Set(),
      isAnimating: true,
      currentIndex: 0,
    });

    // Stagger the appearance of items
    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          visibleItems: new Set([...prev.visibleItems, i]),
          currentIndex: i + 1,
          isAnimating: i < itemCount - 1,
        }));
      }, i * staggerDelay);

      timeouts.push(timeout);
    }

    // Cleanup timeouts
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [itemCount, staggerDelay, enabled]);

  // Helper function to get animation styles for an item
  const getItemAnimationStyles = (index: number): React.CSSProperties => {
    if (!enabled) {
      return {};
    }

    const isVisible = state.visibleItems.has(index);
    const delay = index * staggerDelay;

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity ${animationDuration}ms ease-out ${delay}ms, transform ${animationDuration}ms ease-out ${delay}ms`,
    };
  };

  // Helper function to get animation class for an item
  const getItemAnimationClass = (index: number): string => {
    if (!enabled) {
      return '';
    }

    const isVisible = state.visibleItems.has(index);
    return isVisible ? 'animate-fade-in-stagger' : '';
  };

  return {
    visibleItems: state.visibleItems,
    isAnimating: state.isAnimating,
    currentIndex: state.currentIndex,
    getItemAnimationStyles,
    getItemAnimationClass,
    isItemVisible: (index: number) => state.visibleItems.has(index),
  };
}
