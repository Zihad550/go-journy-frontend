import { useCallback, useEffect, useRef, useState } from "react";

// User behavior tracking types
interface UserBehaviorPattern {
  tabId: string;
  visitCount: number;
  totalTimeSpent: number;
  averageTimeSpent: number;
  lastVisited: number;
  transitionProbability: Map<string, number>; // Probability of switching to other tabs
}

interface PreloadPriority {
  tabId: string;
  priority: number; // 0-100, higher is more important
  reason: "adjacent" | "frequent" | "predicted" | "manual";
  confidence: number; // 0-1, confidence in the prediction
}

interface PreloadCache {
  tabId: string;
  content: any;
  timestamp: number;
  size: number;
  accessCount: number;
  lastAccessed: number;
}

interface PreloadConfig {
  maxCacheSize: number; // Maximum cache size in MB
  maxCacheAge: number; // Maximum age in milliseconds
  preloadThreshold: number; // Minimum priority to trigger preload
  behaviorTrackingEnabled: boolean;
  intersectionThreshold: number; // Intersection observer threshold
  preloadDelay: number; // Delay before preloading in ms
}

interface UseTabPreloaderOptions {
  validTabs: string[];
  activeTab: string;
  config?: Partial<PreloadConfig>;
  onPreloadComplete?: (tabId: string, success: boolean) => void;
  onCacheEvicted?: (tabId: string, reason: string) => void;
}

const DEFAULT_CONFIG: PreloadConfig = {
  maxCacheSize: 50, // 50MB
  maxCacheAge: 30 * 60 * 1000, // 30 minutes
  preloadThreshold: 30, // Preload if priority >= 30
  behaviorTrackingEnabled: true,
  intersectionThreshold: 0.1,
  preloadDelay: 500, // 500ms delay
};

export function useTabPreloader({
  validTabs,
  activeTab,
  config = {},
  onPreloadComplete,
  onCacheEvicted,
}: UseTabPreloaderOptions) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // User behavior tracking
  const [behaviorPatterns, setBehaviorPatterns] = useState<
    Map<string, UserBehaviorPattern>
  >(new Map());

  // Preload cache
  const [preloadCache, setPreloadCache] = useState<Map<string, PreloadCache>>(
    new Map(),
  );

  // Current preload priorities
  const [preloadPriorities, setPreloadPriorities] = useState<PreloadPriority[]>(
    [],
  );

  // Intersection observer for background loading
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const preloadTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const tabStartTime = useRef<number>(Date.now());

  // Initialize intersection observer for background loading
  useEffect(() => {
    if (typeof window === "undefined") return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tabId = entry.target.getAttribute("data-tab-id");
          if (!tabId || !validTabs.includes(tabId)) return;

          if (entry.isIntersecting) {
            // Tab trigger is visible, increase preload priority
            updatePreloadPriority(tabId, "adjacent", 20);
          }
        });
      },
      {
        threshold: finalConfig.intersectionThreshold,
        rootMargin: "50px",
      },
    );

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [validTabs, finalConfig.intersectionThreshold]);

  // Track user behavior patterns
  const trackTabVisit = useCallback(
    (tabId: string) => {
      if (!finalConfig.behaviorTrackingEnabled) return;

      const now = Date.now();
      const timeSpent = now - tabStartTime.current;

      setBehaviorPatterns((prev) => {
        const newPatterns = new Map(prev);
        const existing = newPatterns.get(tabId) || {
          tabId,
          visitCount: 0,
          totalTimeSpent: 0,
          averageTimeSpent: 0,
          lastVisited: 0,
          transitionProbability: new Map(),
        };

        const newVisitCount = existing.visitCount + 1;
        const newTotalTime = existing.totalTimeSpent + timeSpent;

        newPatterns.set(tabId, {
          ...existing,
          visitCount: newVisitCount,
          totalTimeSpent: newTotalTime,
          averageTimeSpent: newTotalTime / newVisitCount,
          lastVisited: now,
        });

        return newPatterns;
      });

      tabStartTime.current = now;
    },
    [finalConfig.behaviorTrackingEnabled],
  );

  // Track tab transitions for prediction
  const trackTabTransition = useCallback(
    (fromTab: string, toTab: string) => {
      if (!finalConfig.behaviorTrackingEnabled || !fromTab || !toTab) return;

      setBehaviorPatterns((prev) => {
        const newPatterns = new Map(prev);
        const fromPattern = newPatterns.get(fromTab);

        if (fromPattern) {
          const transitions = new Map(fromPattern.transitionProbability);
          const currentCount = transitions.get(toTab) || 0;
          transitions.set(toTab, currentCount + 1);

          newPatterns.set(fromTab, {
            ...fromPattern,
            transitionProbability: transitions,
          });
        }

        return newPatterns;
      });
    },
    [finalConfig.behaviorTrackingEnabled],
  );

  // Calculate preload priorities based on user behavior
  const calculatePreloadPriorities = useCallback((): PreloadPriority[] => {
    const priorities: PreloadPriority[] = [];
    const currentIndex = validTabs.indexOf(activeTab);

    // Adjacent tabs (always high priority)
    if (currentIndex > 0) {
      priorities.push({
        tabId: validTabs[currentIndex - 1],
        priority: 80,
        reason: "adjacent",
        confidence: 0.9,
      });
    }
    if (currentIndex < validTabs.length - 1) {
      priorities.push({
        tabId: validTabs[currentIndex + 1],
        priority: 80,
        reason: "adjacent",
        confidence: 0.9,
      });
    }

    // Frequently visited tabs
    behaviorPatterns.forEach((pattern) => {
      if (pattern.tabId === activeTab) return;

      const recencyScore = Math.max(
        0,
        1 - (Date.now() - pattern.lastVisited) / (24 * 60 * 60 * 1000),
      );
      const frequencyScore = Math.min(1, pattern.visitCount / 10);
      const timeScore = Math.min(1, pattern.averageTimeSpent / (5 * 60 * 1000)); // 5 minutes max

      const priority = Math.round(
        recencyScore * 30 + frequencyScore * 40 + timeScore * 30,
      );

      if (priority >= finalConfig.preloadThreshold) {
        priorities.push({
          tabId: pattern.tabId,
          priority,
          reason: "frequent",
          confidence: (recencyScore + frequencyScore + timeScore) / 3,
        });
      }
    });

    // Predicted tabs based on transition patterns
    const currentPattern = behaviorPatterns.get(activeTab);
    if (currentPattern) {
      const totalTransitions = Array.from(
        currentPattern.transitionProbability.values(),
      ).reduce((sum, count) => sum + count, 0);

      currentPattern.transitionProbability.forEach((count, tabId) => {
        if (tabId === activeTab) return;

        const probability = count / totalTransitions;
        const priority = Math.round(probability * 70);

        if (priority >= finalConfig.preloadThreshold) {
          priorities.push({
            tabId,
            priority,
            reason: "predicted",
            confidence: probability,
          });
        }
      });
    }

    // Remove duplicates and sort by priority
    const uniquePriorities = new Map<string, PreloadPriority>();
    priorities.forEach((priority) => {
      const existing = uniquePriorities.get(priority.tabId);
      if (!existing || priority.priority > existing.priority) {
        uniquePriorities.set(priority.tabId, priority);
      }
    });

    return Array.from(uniquePriorities.values()).sort(
      (a, b) => b.priority - a.priority,
    );
  }, [validTabs, activeTab, behaviorPatterns, finalConfig.preloadThreshold]);

  // Update preload priority for a specific tab
  const updatePreloadPriority = useCallback(
    (
      tabId: string,
      reason: PreloadPriority["reason"],
      additionalPriority: number,
    ) => {
      setPreloadPriorities((prev) => {
        const newPriorities = [...prev];
        const existingIndex = newPriorities.findIndex((p) => p.tabId === tabId);

        if (existingIndex >= 0) {
          newPriorities[existingIndex] = {
            ...newPriorities[existingIndex],
            priority: Math.min(
              100,
              newPriorities[existingIndex].priority + additionalPriority,
            ),
          };
        } else {
          newPriorities.push({
            tabId,
            priority: additionalPriority,
            reason,
            confidence: 0.5,
          });
        }

        return newPriorities.sort((a, b) => b.priority - a.priority);
      });
    },
    [],
  );

  // Cache management
  const evictOldCache = useCallback(() => {
    const now = Date.now();
    const maxAge = finalConfig.maxCacheAge;

    setPreloadCache((prev) => {
      const newCache = new Map(prev);
      const toEvict: string[] = [];

      // Find expired entries
      newCache.forEach((entry, tabId) => {
        if (now - entry.timestamp > maxAge) {
          toEvict.push(tabId);
        }
      });

      // Evict expired entries
      toEvict.forEach((tabId) => {
        newCache.delete(tabId);
        onCacheEvicted?.(tabId, "expired");
      });

      return newCache;
    });
  }, [finalConfig.maxCacheAge, onCacheEvicted]);

  // Cache size management
  const manageCacheSize = useCallback(() => {
    setPreloadCache((prev) => {
      const entries = Array.from(prev.entries());
      const totalSize = entries.reduce((sum, [, entry]) => sum + entry.size, 0);
      const maxSizeBytes = finalConfig.maxCacheSize * 1024 * 1024; // Convert MB to bytes

      if (totalSize <= maxSizeBytes) return prev;

      // Sort by access patterns (LRU with access count consideration)
      const sortedEntries = entries.sort((a, b) => {
        const aScore =
          a[1].accessCount * 0.3 + (Date.now() - a[1].lastAccessed) * 0.7;
        const bScore =
          b[1].accessCount * 0.3 + (Date.now() - b[1].lastAccessed) * 0.7;
        return aScore - bScore; // Lower score = more likely to be evicted
      });

      const newCache = new Map(prev);
      let currentSize = totalSize;

      // Evict least valuable entries
      for (const [tabId, entry] of sortedEntries) {
        if (currentSize <= maxSizeBytes) break;

        newCache.delete(tabId);
        currentSize -= entry.size;
        onCacheEvicted?.(tabId, "size-limit");
      }

      return newCache;
    });
  }, [finalConfig.maxCacheSize, onCacheEvicted]);

  // Preload tab content
  const preloadTab = useCallback(
    async (tabId: string): Promise<boolean> => {
      if (!validTabs.includes(tabId) || preloadCache.has(tabId)) {
        return true;
      }

      try {
        // Simulate content loading - in real implementation, this would load actual content
        const mockContent = {
          tabId,
          data: `Preloaded content for ${tabId}`,
          timestamp: Date.now(),
        };

        // Simulate loading time based on content complexity
        const loadingTime = Math.random() * 200 + 100; // 100-300ms
        await new Promise((resolve) => setTimeout(resolve, loadingTime));

        // Calculate approximate content size (mock)
        const contentSize = JSON.stringify(mockContent).length;

        // Add to cache
        setPreloadCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(tabId, {
            tabId,
            content: mockContent,
            timestamp: Date.now(),
            size: contentSize,
            accessCount: 0,
            lastAccessed: Date.now(),
          });
          return newCache;
        });

        onPreloadComplete?.(tabId, true);
        return true;
      } catch {
        onPreloadComplete?.(tabId, false);
        return false;
      }
    },
    [validTabs, preloadCache, onPreloadComplete],
  );

  // Get cached content
  const getCachedContent = useCallback(
    (tabId: string) => {
      const cached = preloadCache.get(tabId);
      if (!cached) return null;

      // Update access statistics
      setPreloadCache((prev) => {
        const newCache = new Map(prev);
        const entry = newCache.get(tabId);
        if (entry) {
          newCache.set(tabId, {
            ...entry,
            accessCount: entry.accessCount + 1,
            lastAccessed: Date.now(),
          });
        }
        return newCache;
      });

      return cached.content;
    },
    [preloadCache],
  );

  // Execute preloading based on priorities
  const executePreloading = useCallback(async () => {
    const priorities = calculatePreloadPriorities();
    setPreloadPriorities(priorities);

    // Clear existing timeouts
    preloadTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    preloadTimeoutsRef.current.clear();

    // Schedule preloading based on priorities
    priorities.forEach((priority, index) => {
      if (priority.priority < finalConfig.preloadThreshold) return;

      const delay = finalConfig.preloadDelay + index * 100; // Stagger preloading
      const timeout = setTimeout(() => {
        preloadTab(priority.tabId);
      }, delay);

      preloadTimeoutsRef.current.set(priority.tabId, timeout);
    });
  }, [
    calculatePreloadPriorities,
    finalConfig.preloadThreshold,
    finalConfig.preloadDelay,
    preloadTab,
  ]);

  // Manual preload trigger
  const triggerPreload = useCallback(
    (tabId: string, priority: number = 100) => {
      updatePreloadPriority(tabId, "manual", priority);

      const timeout = setTimeout(() => {
        preloadTab(tabId);
      }, finalConfig.preloadDelay);

      preloadTimeoutsRef.current.set(tabId, timeout);
    },
    [updatePreloadPriority, preloadTab, finalConfig.preloadDelay],
  );

  // Clear cache for specific tab
  const clearTabCache = useCallback((tabId: string) => {
    setPreloadCache((prev) => {
      const newCache = new Map(prev);
      newCache.delete(tabId);
      return newCache;
    });
  }, []);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    setPreloadCache(new Map());
  }, []);

  // Track active tab changes
  useEffect(() => {
    trackTabVisit(activeTab);
  }, [activeTab, trackTabVisit]);

  // Execute preloading when priorities change
  useEffect(() => {
    const timeoutId = setTimeout(executePreloading, 100);
    return () => clearTimeout(timeoutId);
  }, [activeTab, behaviorPatterns]);

  // Periodic cache maintenance
  useEffect(() => {
    const interval = setInterval(() => {
      evictOldCache();
      manageCacheSize();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [evictOldCache, manageCacheSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      preloadTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      preloadTimeoutsRef.current.clear();
      intersectionObserverRef.current?.disconnect();
    };
  }, []);

  // Observe tab triggers for intersection-based preloading
  const observeTabTrigger = useCallback(
    (element: HTMLElement, tabId: string) => {
      if (!intersectionObserverRef.current) return;

      element.setAttribute("data-tab-id", tabId);
      intersectionObserverRef.current.observe(element);

      return () => {
        intersectionObserverRef.current?.unobserve(element);
      };
    },
    [],
  );

  return {
    // State
    behaviorPatterns,
    preloadCache,
    preloadPriorities,

    // Actions
    preloadTab,
    triggerPreload,
    getCachedContent,
    clearTabCache,
    clearAllCache,
    trackTabTransition,
    observeTabTrigger,

    // Utilities
    isTabCached: (tabId: string) => preloadCache.has(tabId),
    getCacheSize: () =>
      Array.from(preloadCache.values()).reduce(
        (sum, entry) => sum + entry.size,
        0,
      ),
    getCacheStats: () => ({
      totalEntries: preloadCache.size,
      totalSize: Array.from(preloadCache.values()).reduce(
        (sum, entry) => sum + entry.size,
        0,
      ),
      oldestEntry: Math.min(
        ...Array.from(preloadCache.values()).map((entry) => entry.timestamp),
      ),
      newestEntry: Math.max(
        ...Array.from(preloadCache.values()).map((entry) => entry.timestamp),
      ),
    }),
  };
}
