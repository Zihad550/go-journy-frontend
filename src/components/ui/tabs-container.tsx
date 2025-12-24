import { cn } from '@/lib/utils';
import * as React from 'react';
import { useTabsURL } from '@/hooks/use-tabs-u-r-l';
import { Skeleton } from '@/components/ui/skeleton';
import './tabs-animations.css';

// Performance monitoring utilities
interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  tabSwitchTimes: Map<string, number>;
  memoryUsage?: number;
}

interface PerformanceMonitorOptions {
  enabled: boolean;
  logToConsole: boolean;
  trackMemory: boolean;
  sampleRate: number; // 0-1, percentage of renders to track
}

// Performance monitoring hook
function usePerformanceMonitor(
  componentName: string,
  options: PerformanceMonitorOptions = {
    enabled: process.env.NODE_ENV === 'development',
    logToConsole: false,
    trackMemory: false,
    sampleRate: 0.1,
  }
) {
  const metricsRef = React.useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    tabSwitchTimes: new Map(),
  });

  const startTimeRef = React.useRef<number>(0);

  // Start performance measurement
  const startMeasurement = React.useCallback(() => {
    if (!options.enabled || Math.random() > options.sampleRate) return;
    startTimeRef.current = performance.now();
  }, [options.enabled, options.sampleRate]);

  // End performance measurement
  const endMeasurement = React.useCallback(() => {
    if (!options.enabled || startTimeRef.current === 0) return;

    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    const metrics = metricsRef.current;

    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.averageRenderTime =
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) /
      metrics.renderCount;

    // Track memory usage if enabled
    if (options.trackMemory && 'memory' in performance) {
      metrics.memoryUsage = (performance as any).memory?.usedJSHeapSize;
    }

    // Log to console if enabled
    if (options.logToConsole) {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        renderCount: metrics.renderCount,
        memoryUsage: metrics.memoryUsage
          ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
          : 'N/A',
      });
    }

    startTimeRef.current = 0;
  }, [
    options.enabled,
    options.logToConsole,
    options.trackMemory,
    componentName,
  ]);

  // Track tab switch performance
  const trackTabSwitch = React.useCallback(
    (tabId: string) => {
      if (!options.enabled) return;
      metricsRef.current.tabSwitchTimes.set(tabId, performance.now());
    },
    [options.enabled]
  );

  // Get performance metrics
  const getMetrics = React.useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Reset metrics
  const resetMetrics = React.useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      tabSwitchTimes: new Map(),
    };
  }, []);

  return {
    startMeasurement,
    endMeasurement,
    trackTabSwitch,
    getMetrics,
    resetMetrics,
  };
}


// Animation configuration types
interface TransitionConfig {
  type: 'fade' | 'slide' | 'scale' | 'custom';
  duration: number;
  delay: number;
  easing: string;
}

interface AnimationConfig {
  duration: number;
  easing: string;
  stagger: number;
  transitions: {
    fadeIn: TransitionConfig;
    slideIn: TransitionConfig;
    scaleIn: TransitionConfig;
  };
}

// Animation state management
interface AnimationState {
  isTransitioning: boolean;
  previousTab: string | null;
  animationPhase: 'idle' | 'exit' | 'enter';
  staggerIndex: number;
}

// Lazy loading state management
interface LazyLoadingState {
  loadedTabs: Set<string>;
  preloadedTabs: Set<string>;
  loadingTabs: Set<string>;
  errorTabs: Set<string>;
  retryCount: Map<string, number>;
}

// Content loading configuration
interface ContentLoadingConfig {
  lazy?: boolean;
  preload?: boolean;
  preloadAdjacent?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  skeletonRows?: number;
}

interface TabsContainerProps {
  defaultTab?: string;
  urlSync?: boolean;
  persistPreferences?: boolean;
  animationPreset?: 'smooth' | 'fast' | 'minimal';
  swipeEnabled?: boolean;
  keyboardShortcuts?: boolean;
  validTabs?: string[];
  urlParamName?: string;
  replaceHistory?: boolean;
  onTabChange?: (tabId: string, previousTab: string | null) => void;
  enableAnimations?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale';
  staggerChildren?: boolean;
  // Lazy loading configuration
  enableLazyLoading?: boolean;
  preloadAdjacent?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  children: React.ReactNode;
  className?: string;
}

// Context for URL-synchronized tabs with animation support
interface URLTabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isValidTab: (tab: string) => boolean;
  previousTab: string | null;
  animationState: AnimationState;
  animationConfig: AnimationConfig;
  enableAnimations: boolean;
  transitionType: 'fade' | 'slide' | 'scale';
  staggerChildren: boolean;
  // Lazy loading state and actions
  lazyLoadingState: LazyLoadingState;
  enableLazyLoading: boolean;
  preloadAdjacent: boolean;
  maxRetries: number;
  retryDelay: number;
  loadTab: (tabId: string) => Promise<void>;
  preloadTab: (tabId: string) => Promise<void>;
  retryLoadTab: (tabId: string) => Promise<void>;
  isTabLoaded: (tabId: string) => boolean;
  isTabLoading: (tabId: string) => boolean;
  isTabError: (tabId: string) => boolean;
}

const URLTabsContext = React.createContext<URLTabsContextValue | undefined>(
  undefined
);

// Hook to use URL-synchronized tabs context
export function useURLTabs() {
  const context = React.useContext(URLTabsContext);
  if (!context) {
    throw new Error('useURLTabs must be used within a TabsContainer');
  }
  return context;
}

// Default animation configurations
const getAnimationConfig = (
  preset: 'smooth' | 'fast' | 'minimal'
): AnimationConfig => {
  switch (preset) {
    case 'fast':
      return {
        duration: 150,
        easing: 'ease-out',
        stagger: 25,
        transitions: {
          fadeIn: { type: 'fade', duration: 100, delay: 0, easing: 'ease-out' },
          slideIn: {
            type: 'slide',
            duration: 150,
            delay: 0,
            easing: 'ease-out',
          },
          scaleIn: {
            type: 'scale',
            duration: 125,
            delay: 0,
            easing: 'ease-out',
          },
        },
      };
    case 'minimal':
      return {
        duration: 0,
        easing: 'linear',
        stagger: 0,
        transitions: {
          fadeIn: { type: 'fade', duration: 0, delay: 0, easing: 'linear' },
          slideIn: { type: 'slide', duration: 0, delay: 0, easing: 'linear' },
          scaleIn: { type: 'scale', duration: 0, delay: 0, easing: 'linear' },
        },
      };
    default: // 'smooth'
      return {
        duration: 300,
        easing: 'ease-in-out',
        stagger: 50,
        transitions: {
          fadeIn: { type: 'fade', duration: 200, delay: 0, easing: 'ease-out' },
          slideIn: {
            type: 'slide',
            duration: 300,
            delay: 0,
            easing: 'ease-in-out',
          },
          scaleIn: {
            type: 'scale',
            duration: 250,
            delay: 0,
            easing: 'ease-out',
          },
        },
      };
  }
};

/**
 * Enhanced TabsContainer with URL synchronization, animation support, and lazy loading
 * Provides shareable tab states through URL parameters with smooth transitions and performance optimization
 */
export function TabsContainer({
  defaultTab = '',
  urlSync = true,
  validTabs = [],
  urlParamName = 'tab',
  replaceHistory = false,
  animationPreset = 'smooth',
  enableAnimations = true,
  transitionType = 'fade',
  staggerChildren = true,
  enableLazyLoading = true,
  preloadAdjacent = true,
  maxRetries = 3,
  retryDelay = 1000,
  onTabChange,
  children,
  className,
}: TabsContainerProps) {
  // Performance monitoring
  const performanceMonitor = usePerformanceMonitor('TabsContainer', {
    enabled: process.env.NODE_ENV === 'development',
    logToConsole: false,
    trackMemory: true,
    sampleRate: 0.2,
  });

  // Start performance measurement
  performanceMonitor.startMeasurement();
  // Animation configuration
  const animationConfig = React.useMemo(
    () => getAnimationConfig(animationPreset),
    [animationPreset]
  );

  // Animation state management
  const [animationState, setAnimationState] = React.useState<AnimationState>({
    isTransitioning: false,
    previousTab: null,
    animationPhase: 'idle',
    staggerIndex: 0,
  });

  // Track previous tab for callbacks
  const [previousTab, setPreviousTab] = React.useState<string | null>(null);

  // Debounce rapid tab switching
  const [isDebouncing, setIsDebouncing] = React.useState(false);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Lazy loading state management
  const [lazyLoadingState, setLazyLoadingState] =
    React.useState<LazyLoadingState>({
      loadedTabs: new Set(defaultTab ? [defaultTab] : []),
      preloadedTabs: new Set(),
      loadingTabs: new Set(),
      errorTabs: new Set(),
      retryCount: new Map(),
    });

  // Loading timeout refs for cleanup
  const loadingTimeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(
    new Map()
  );

  // Always call useTabsURL hook to maintain hook order
  const urlTabsResult = useTabsURL({
    paramName: urlParamName,
    validTabs,
    defaultTab,
    replaceHistory,
  });

  // Fallback state for non-URL sync mode
  const [fallbackActiveTab, setFallbackActiveTab] = React.useState(defaultTab);

  const activeTab = urlSync ? urlTabsResult.activeTab : fallbackActiveTab;
  const setURLTab = urlSync ? urlTabsResult.setActiveTab : setFallbackActiveTab;

  const isValidTab = React.useMemo(() => {
    if (urlSync) {
      return urlTabsResult.isValidTab;
    }
    return (tab: string) => validTabs.length === 0 || validTabs.includes(tab);
  }, [urlSync, urlTabsResult.isValidTab, validTabs]);

  // Lazy loading utility functions
  const loadTab = React.useCallback(
    async (tabId: string): Promise<void> => {
      if (
        !enableLazyLoading ||
        lazyLoadingState.loadedTabs.has(tabId) ||
        lazyLoadingState.loadingTabs.has(tabId)
      ) {
        return;
      }

      // Mark as loading
      setLazyLoadingState((prev) => ({
        ...prev,
        loadingTabs: new Set([...prev.loadingTabs, tabId]),
        errorTabs: new Set([...prev.errorTabs].filter((id) => id !== tabId)),
      }));

      try {
        // Simulate content loading with a small delay for demonstration
        // In a real implementation, this would load actual content
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 100);
          loadingTimeoutsRef.current.set(tabId, timeout);
        });

        // Mark as loaded
        setLazyLoadingState((prev) => ({
          ...prev,
          loadedTabs: new Set([...prev.loadedTabs, tabId]),
          loadingTabs: new Set(
            [...prev.loadingTabs].filter((id) => id !== tabId)
          ),
          preloadedTabs: new Set([...prev.preloadedTabs, tabId]),
        }));

        // Clean up timeout reference
        loadingTimeoutsRef.current.delete(tabId);
      } catch (error) {
        console.error(`Failed to load tab content for ${tabId}:`, error);

        // Mark as error
        setLazyLoadingState((prev) => ({
          ...prev,
          loadingTabs: new Set(
            [...prev.loadingTabs].filter((id) => id !== tabId)
          ),
          errorTabs: new Set([...prev.errorTabs, tabId]),
        }));

        // Clean up timeout reference
        loadingTimeoutsRef.current.delete(tabId);
      }
    },
    [
      enableLazyLoading,
      lazyLoadingState.loadedTabs,
      lazyLoadingState.loadingTabs,
    ]
  );

  const preloadTab = React.useCallback(
    async (tabId: string): Promise<void> => {
      if (!enableLazyLoading || lazyLoadingState.preloadedTabs.has(tabId)) {
        return;
      }

      // Mark as preloaded immediately to prevent duplicate preloading
      setLazyLoadingState((prev) => ({
        ...prev,
        preloadedTabs: new Set([...prev.preloadedTabs, tabId]),
      }));

      // Load the tab content
      await loadTab(tabId);
    },
    [enableLazyLoading, lazyLoadingState.preloadedTabs, loadTab]
  );

  const retryLoadTab = React.useCallback(
    async (tabId: string): Promise<void> => {
      const currentRetries = lazyLoadingState.retryCount.get(tabId) || 0;

      if (currentRetries >= maxRetries) {
        console.warn(`Max retries (${maxRetries}) reached for tab ${tabId}`);
        return;
      }

      // Update retry count
      setLazyLoadingState((prev) => ({
        ...prev,
        retryCount: new Map([...prev.retryCount, [tabId, currentRetries + 1]]),
        errorTabs: new Set([...prev.errorTabs].filter((id) => id !== tabId)),
      }));

      // Wait for retry delay
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      // Attempt to load again
      await loadTab(tabId);
    },
    [lazyLoadingState.retryCount, maxRetries, retryDelay, loadTab]
  );

  // Utility functions for checking tab states
  const isTabLoaded = React.useCallback(
    (tabId: string): boolean => {
      return !enableLazyLoading || lazyLoadingState.loadedTabs.has(tabId);
    },
    [enableLazyLoading, lazyLoadingState.loadedTabs]
  );

  const isTabLoading = React.useCallback(
    (tabId: string): boolean => {
      return enableLazyLoading && lazyLoadingState.loadingTabs.has(tabId);
    },
    [enableLazyLoading, lazyLoadingState.loadingTabs]
  );

  const isTabError = React.useCallback(
    (tabId: string): boolean => {
      return enableLazyLoading && lazyLoadingState.errorTabs.has(tabId);
    },
    [enableLazyLoading, lazyLoadingState.errorTabs]
  );

  // Preload adjacent tabs when active tab changes
  React.useEffect(() => {
    if (!preloadAdjacent || !enableLazyLoading || validTabs.length === 0) {
      return;
    }

    const currentIndex = validTabs.indexOf(activeTab);
    if (currentIndex === -1) return;

    // Preload previous and next tabs
    const adjacentTabs = [
      validTabs[currentIndex - 1], // Previous tab
      validTabs[currentIndex + 1], // Next tab
    ].filter(Boolean);

    adjacentTabs.forEach((tabId) => {
      if (!lazyLoadingState.preloadedTabs.has(tabId)) {
        preloadTab(tabId);
      }
    });
  }, [
    activeTab,
    validTabs,
    preloadAdjacent,
    enableLazyLoading,
    lazyLoadingState.preloadedTabs,
    preloadTab,
  ]);

  // Enhanced setActiveTab with animation and debouncing support
  const setActiveTab = React.useCallback(
    (tab: string) => {
      // Prevent rapid switching during transitions
      if (
        isDebouncing ||
        (enableAnimations && animationState.isTransitioning)
      ) {
        return;
      }

      const currentTab = activeTab;

      // Skip if same tab
      if (currentTab === tab) {
        return;
      }

      // Update previous tab
      setPreviousTab(currentTab);

      // Load tab content if lazy loading is enabled
      if (enableLazyLoading && !isTabLoaded(tab)) {
        loadTab(tab);
      }

      // Handle animations if enabled
      if (enableAnimations && animationConfig.duration > 0) {
        // Start exit animation
        setAnimationState({
          isTransitioning: true,
          previousTab: currentTab,
          animationPhase: 'exit',
          staggerIndex: 0,
        });

        // Set debouncing to prevent rapid switching
        setIsDebouncing(true);
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Transition to enter phase after exit duration
        const exitDuration = animationConfig.duration * 0.4; // 40% for exit
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            animationPhase: 'enter',
          }));

          // Update URL and state
          setURLTab(tab);
        }, exitDuration);

        // Complete transition after full duration
        const totalDuration = animationConfig.duration;
        debounceTimeoutRef.current = setTimeout(() => {
          setAnimationState({
            isTransitioning: false,
            previousTab: null,
            animationPhase: 'idle',
            staggerIndex: 0,
          });
          setIsDebouncing(false);
        }, totalDuration);
      } else {
        // No animations - immediate switch
        setURLTab(tab);
      }

      // Call external callback
      if (onTabChange) {
        onTabChange(tab, currentTab);
      }
    },
    [
      activeTab,
      setURLTab,
      onTabChange,
      enableAnimations,
      animationConfig.duration,
      animationState.isTransitioning,
      isDebouncing,
      enableLazyLoading,
      isTabLoaded,
      loadTab,
    ]
  );

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    const currentLoadingTimeouts = loadingTimeoutsRef.current;
    const currentDebounceTimeout = debounceTimeoutRef.current;

    return () => {
      if (currentDebounceTimeout) {
        clearTimeout(currentDebounceTimeout);
      }

      // Clean up all loading timeouts
      currentLoadingTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      currentLoadingTimeouts.clear();
    };
  }, []);

  // Context value with animation and lazy loading support
  const contextValue = React.useMemo(
    () => ({
      activeTab,
      setActiveTab,
      isValidTab,
      previousTab,
      animationState,
      animationConfig,
      enableAnimations,
      transitionType,
      staggerChildren,
      lazyLoadingState,
      enableLazyLoading,
      preloadAdjacent,
      maxRetries,
      retryDelay,
      loadTab,
      preloadTab,
      retryLoadTab,
      isTabLoaded,
      isTabLoading,
      isTabError,
    }),
    [
      activeTab,
      setActiveTab,
      isValidTab,
      previousTab,
      animationState,
      animationConfig,
      enableAnimations,
      transitionType,
      staggerChildren,
      lazyLoadingState,
      enableLazyLoading,
      preloadAdjacent,
      maxRetries,
      retryDelay,
      loadTab,
      preloadTab,
      retryLoadTab,
      isTabLoaded,
      isTabLoading,
      isTabError,
    ]
  );

  // End performance measurement
  React.useLayoutEffect(() => {
    performanceMonitor.endMeasurement();
  });

  // Always provide context, regardless of URL sync setting
  return (
    <URLTabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>{children}</div>
    </URLTabsContext.Provider>
  );
}

// Enhanced TabsList component for URL-synchronized tabs
interface URLTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function URLTabsList({ children, className }: URLTabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  );
}

// Enhanced TabsTrigger component for URL-synchronized tabs
interface URLTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const URLTabsTrigger = React.memo<URLTabsTriggerProps>(
  function URLTabsTrigger({ value, children, className, disabled }) {
    const {
      activeTab,
      setActiveTab,
      isValidTab,
      animationState,
      enableAnimations,
    } = useURLTabs();
    const isSelected = activeTab === value;
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Performance monitoring for development
    React.useLayoutEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now();
        return () => {
          const end = performance.now();
          if (end - start > 16) {
            console.warn(
              `[URLTabsTrigger-${value}] Slow render: ${(end - start).toFixed(
                2
              )}ms`
            );
          }
        };
      }
    });

    // Prevent interaction during transitions
    const isInteractionDisabled = React.useMemo(
      () => disabled || (enableAnimations && animationState.isTransitioning),
      [disabled, enableAnimations, animationState.isTransitioning]
    );

    const handleClick = React.useCallback(() => {
      if (!isInteractionDisabled && isValidTab(value)) {
        setActiveTab(value);
      }
    }, [isInteractionDisabled, isValidTab, value, setActiveTab]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const tablist = event.currentTarget.closest('[role="tablist"]');
        if (!tablist) return;

        const tabs = Array.from(
          tablist.querySelectorAll('[role="tab"]:not([disabled])')
        ) as HTMLButtonElement[];
        const currentIndex = tabs.indexOf(event.currentTarget);

        let nextIndex = currentIndex;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            nextIndex = (currentIndex + 1) % tabs.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
            break;
          case 'Home':
            event.preventDefault();
            nextIndex = 0;
            break;
          case 'End':
            event.preventDefault();
            nextIndex = tabs.length - 1;
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (!isInteractionDisabled && isValidTab(value)) {
              setActiveTab(value);
            }
            return;
          default:
            return;
        }

        // Focus the next tab
        tabs[nextIndex]?.focus();
      },
      [isInteractionDisabled, isValidTab, value, setActiveTab]
    );

    const computedClassName = React.useMemo(
      () =>
        cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          // Enhanced transition classes
          enableAnimations
            ? 'tab-trigger-transition'
            : 'transition-all duration-200',
          // State-based styling
          isSelected
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
          // Transition state styling
          animationState.isTransitioning && 'cursor-wait',
          className
        ),
      [enableAnimations, isSelected, animationState.isTransitioning, className]
    );

    return (
      <button
        ref={buttonRef}
        type="button"
        role="tab"
        id={`tab-${value}`}
        aria-selected={isSelected}
        aria-controls={`tabpanel-${value}`}
        disabled={isInteractionDisabled}
        tabIndex={isSelected ? 0 : -1}
        className={computedClassName}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </button>
    );
  }
);

// Default skeleton component for loading states
interface TabsSkeletonProps {
  rows?: number;
  className?: string;
}

function TabsSkeleton({ rows = 3, className }: TabsSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          {index === 0 && <Skeleton className="h-32 w-full" />}
          {index === 1 && <Skeleton className="h-24 w-full" />}
        </div>
      ))}
    </div>
  );
}

// Default error component for failed content loading
interface TabsErrorProps {
  error: Error;
  retry: () => void;
  className?: string;
}

function TabsError({ error, retry, className }: TabsErrorProps) {
  return (
    <div className={cn('text-center py-8 space-y-4', className)}>
      <div className="text-destructive">
        <svg
          className="mx-auto h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Failed to load content</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'An error occurred while loading the tab content.'}
        </p>
        <button
          onClick={retry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Error boundary for tab content loading failures
interface TabsErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorTab: string | null;
}

interface TabsErrorBoundaryProps {
  children: React.ReactNode;
  tabId: string;
  onError?: (error: Error, tabId: string) => void;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class TabsErrorBoundary extends React.Component<
  TabsErrorBoundaryProps,
  TabsErrorBoundaryState
> {
  constructor(props: TabsErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorTab: null,
    };
  }

  static getDerivedStateFromError(error: Error): TabsErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorTab: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TabsErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, this.props.tabId);
    }

    this.setState({
      errorTab: this.props.tabId,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorTab: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || TabsError;
      return (
        <FallbackComponent error={this.state.error} retry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}

// Enhanced TabsContent component with animation and lazy loading support
interface URLTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  // Lazy loading configuration
  lazy?: boolean;
  preload?: boolean;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  skeletonRows?: number;
}

export const URLTabsContent = React.memo<URLTabsContentProps>(
  function URLTabsContent({
    value,
    children,
    className,
    lazy = true,
    preload = false,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent = TabsError,
    skeletonRows = 3,
  }) {
    const {
      activeTab,
      animationState,
      animationConfig,
      enableAnimations,
      transitionType,
      staggerChildren,
      enableLazyLoading,
      isTabLoaded,
      isTabLoading,
      isTabError,
      retryLoadTab,
      preloadTab,
    } = useURLTabs();

    // Performance monitoring for development
    React.useLayoutEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now();
        return () => {
          const end = performance.now();
          if (end - start > 16) {
            console.warn(
              `[URLTabsContent-${value}] Slow render: ${(end - start).toFixed(
                2
              )}ms`
            );
          }
        };
      }
    });

    const isSelected = activeTab === value;
    const isExiting =
      animationState.previousTab === value &&
      animationState.animationPhase === 'exit';
    const isEntering = isSelected && animationState.animationPhase === 'enter';

    // Handle preloading if enabled - must be before any early returns
    React.useEffect(() => {
      if (preload && enableLazyLoading && !isTabLoaded(value)) {
        preloadTab(value);
      }
    }, [preload, enableLazyLoading, value, isTabLoaded, preloadTab]);

    // Handle lazy loading states - must be before any early returns
    const shouldUseLazyLoading = enableLazyLoading && lazy;
    const tabLoaded = isTabLoaded(value);
    const tabLoading = isTabLoading(value);
    const tabError = isTabError(value);

    // Create retry function for error state - must be before any early returns
    const handleRetry = React.useCallback(() => {
      retryLoadTab(value);
    }, [retryLoadTab, value]);

    // Generate animation styles based on transition type and phase - must be before any early returns
    const animationStyles = React.useMemo((): React.CSSProperties => {
      if (!enableAnimations || animationConfig.duration === 0) {
        return {};
      }

      const { duration, easing } = animationConfig;
      const transition = `all ${duration}ms ${easing}`;

      switch (transitionType) {
        case 'fade':
          return {
            transition,
            opacity: isExiting ? 0 : isEntering ? 1 : isSelected ? 1 : 0,
          };

        case 'slide':
          return {
            transition,
            transform: isExiting
              ? 'translateX(-20px)'
              : isEntering
              ? 'translateX(0)'
              : isSelected
              ? 'translateX(0)'
              : 'translateX(20px)',
            opacity: isExiting ? 0 : isEntering ? 1 : isSelected ? 1 : 0,
          };

        case 'scale':
          return {
            transition,
            transform: isExiting
              ? 'scale(0.95)'
              : isEntering
              ? 'scale(1)'
              : isSelected
              ? 'scale(1)'
              : 'scale(0.95)',
            opacity: isExiting ? 0 : isEntering ? 1 : isSelected ? 1 : 0,
          };

        default:
          return {};
      }
    }, [
      enableAnimations,
      animationConfig.duration,
      animationConfig.easing,
      transitionType,
      isExiting,
      isEntering,
      isSelected,
    ]);

    // Staggered animation for children - must be before any early returns
    const getStaggeredChildren = React.useMemo(() => {
      if (
        !staggerChildren ||
        !enableAnimations ||
        animationConfig.stagger === 0
      ) {
        return children;
      }

      return React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const staggerDelay = index * animationConfig.stagger;
        const childStyle: React.CSSProperties = {
          animationDelay: `${staggerDelay}ms`,
          animationDuration: `${animationConfig.duration}ms`,
          animationFillMode: 'both',
          animationTimingFunction: animationConfig.easing,
        };

        // Apply stagger animation class based on phase
        let animationClass = '';
        if (isEntering) {
          switch (transitionType) {
            case 'fade':
              animationClass = 'animate-fade-in-stagger';
              break;
            case 'slide':
              animationClass = 'animate-slide-in-stagger';
              break;
            case 'scale':
              animationClass = 'animate-scale-in-stagger';
              break;
          }
        }

        const childProps = child.props as Record<string, unknown>;
        return React.cloneElement(
          child as React.ReactElement<Record<string, unknown>>,
          {
            style: {
              ...((childProps.style as React.CSSProperties) || {}),
              ...childStyle,
            },
            className: cn(
              (childProps.className as string) || '',
              animationClass
            ),
          }
        );
      });
    }, [
      staggerChildren,
      enableAnimations,
      animationConfig.stagger,
      animationConfig.duration,
      animationConfig.easing,
      children,
      isEntering,
      transitionType,
    ]);

    // Render content based on lazy loading state - must be before any early returns
    const renderedContent = React.useMemo(() => {
      if (!shouldUseLazyLoading || tabLoaded) {
        // Content is loaded or lazy loading is disabled
        return getStaggeredChildren;
      }

      if (tabError) {
        // Error state - show error component
        return (
          <ErrorComponent
            error={new Error('Failed to load tab content')}
            retry={handleRetry}
          />
        );
      }

      if (tabLoading) {
        // Loading state - show loading component
        return LoadingComponent ? (
          <LoadingComponent />
        ) : (
          <TabsSkeleton rows={skeletonRows} />
        );
      }

      // Should not reach here, but fallback
      return null;
    }, [
      shouldUseLazyLoading,
      tabLoaded,
      tabError,
      tabLoading,
      getStaggeredChildren,
      handleRetry,
      LoadingComponent,
      ErrorComponent,
      skeletonRows,
    ]);

    // Don't render if not selected and not in transition - this must be after all hooks
    if (!isSelected && !isExiting) {
      return null;
    }

    return (
      <TabsErrorBoundary
        tabId={value}
        fallback={ErrorComponent}
        onError={(error, tabId) => {
          console.error(`Error in tab ${tabId}:`, error);
        }}
      >
        <div
          role="tabpanel"
          id={`tabpanel-${value}`}
          aria-labelledby={`tab-${value}`}
          style={animationStyles}
          className={cn(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
          )}
        >
          {renderedContent}
        </div>
      </TabsErrorBoundary>
    );
  }
);
// Export all components and types
export {
  TabsSkeleton,
  TabsError,
  TabsErrorBoundary,
  type LazyLoadingState,
  type ContentLoadingConfig,
  type TabsSkeletonProps,
  type TabsErrorProps,
  type TabsErrorBoundaryProps,
};
