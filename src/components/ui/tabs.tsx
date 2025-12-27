import { cn } from "@/lib/utils";
import * as React from "react";

// Enhanced Types and Interfaces
interface TabPreferences {
  lastActiveTab: string;
  preferredAnimations: boolean;
  swipeEnabled: boolean;
  keyboardShortcuts: boolean;
  autoPreload: boolean;
  theme: "auto" | "light" | "dark";
}

interface TransitionConfig {
  type: "fade" | "slide" | "scale" | "custom";
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

interface SwitchOptions {
  skipAnimation?: boolean;
  preload?: boolean;
  updateHistory?: boolean;
}

interface TabsState {
  activeTab: string;
  previousTab: string | null;
  isTransitioning: boolean;
  loadedTabs: Set<string>;
  preloadedTabs: Set<string>;
  userPreferences: TabPreferences;
  animationConfig: AnimationConfig;
}

interface TabsContextValue {
  state: TabsState;
  actions: {
    switchTab: (tabId: string, options?: SwitchOptions) => void;
    preloadTab: (tabId: string) => void;
    updatePreferences: (prefs: Partial<TabPreferences>) => void;
    setAnimationConfig: (config: AnimationConfig) => void;
  };
}

// Action Types
type TabsAction =
  | { type: "SWITCH_TAB"; payload: { tabId: string; options?: SwitchOptions } }
  | { type: "PRELOAD_TAB"; payload: { tabId: string } }
  | {
      type: "UPDATE_PREFERENCES";
      payload: { preferences: Partial<TabPreferences> };
    }
  | { type: "SET_ANIMATION_CONFIG"; payload: { config: AnimationConfig } }
  | { type: "SET_TRANSITION_STATE"; payload: { isTransitioning: boolean } }
  | { type: "MARK_TAB_LOADED"; payload: { tabId: string } };

// Default configurations
const defaultAnimationConfig: AnimationConfig = {
  duration: 300,
  easing: "ease-in-out",
  stagger: 50,
  transitions: {
    fadeIn: {
      type: "fade",
      duration: 200,
      delay: 0,
      easing: "ease-out",
    },
    slideIn: {
      type: "slide",
      duration: 300,
      delay: 0,
      easing: "ease-in-out",
    },
    scaleIn: {
      type: "scale",
      duration: 250,
      delay: 0,
      easing: "ease-out",
    },
  },
};

const defaultPreferences: TabPreferences = {
  lastActiveTab: "",
  preferredAnimations: true,
  swipeEnabled: true,
  keyboardShortcuts: true,
  autoPreload: true,
  theme: "auto",
};

// Reducer function
function tabsReducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case "SWITCH_TAB": {
      const { tabId, options = {} } = action.payload;

      if (tabId === state.activeTab) {
        return state;
      }

      const newLoadedTabs = new Set(state.loadedTabs);
      newLoadedTabs.add(tabId);

      return {
        ...state,
        previousTab: state.activeTab,
        activeTab: tabId,
        isTransitioning: !options.skipAnimation,
        loadedTabs: newLoadedTabs,
        userPreferences: {
          ...state.userPreferences,
          lastActiveTab: tabId,
        },
      };
    }

    case "PRELOAD_TAB": {
      const { tabId } = action.payload;
      const newPreloadedTabs = new Set(state.preloadedTabs);
      newPreloadedTabs.add(tabId);

      return {
        ...state,
        preloadedTabs: newPreloadedTabs,
      };
    }

    case "UPDATE_PREFERENCES": {
      const { preferences } = action.payload;
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...preferences,
        },
      };
    }

    case "SET_ANIMATION_CONFIG": {
      const { config } = action.payload;
      return {
        ...state,
        animationConfig: config,
      };
    }

    case "SET_TRANSITION_STATE": {
      const { isTransitioning } = action.payload;
      return {
        ...state,
        isTransitioning,
      };
    }

    case "MARK_TAB_LOADED": {
      const { tabId } = action.payload;
      const newLoadedTabs = new Set(state.loadedTabs);
      newLoadedTabs.add(tabId);

      return {
        ...state,
        loadedTabs: newLoadedTabs,
      };
    }

    default:
      return state;
  }
}

// Enhanced Context
const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

// Legacy Context for backward compatibility
interface LegacyTabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const LegacyTabsContext = React.createContext<
  LegacyTabsContextType | undefined
>(undefined);

// Enhanced hook for new TabsProvider
function useEnhancedTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(
      "useEnhancedTabs must be used within an enhanced TabsProvider",
    );
  }
  return context;
}

// Legacy hook for backward compatibility
function useTabs() {
  const legacyContext = React.useContext(LegacyTabsContext);
  const enhancedContext = React.useContext(TabsContext);

  // If enhanced context is available, provide legacy interface
  if (enhancedContext) {
    return {
      value: enhancedContext.state.activeTab,
      onValueChange: (value: string) =>
        enhancedContext.actions.switchTab(value),
    };
  }

  // Fall back to legacy context
  if (legacyContext) {
    return legacyContext;
  }

  throw new Error("useTabs must be used within a TabsProvider");
}

// Enhanced TabsProvider Props
interface EnhancedTabsProviderProps {
  defaultTab?: string;
  urlSync?: boolean;
  persistPreferences?: boolean;
  animationPreset?: "smooth" | "fast" | "minimal";
  swipeEnabled?: boolean;
  keyboardShortcuts?: boolean;
  onTabChange?: (tabId: string, previousTab: string | null) => void;
  children: React.ReactNode;
}

// Legacy TabsProps for backward compatibility
interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

// Enhanced TabsProvider with advanced state management
function EnhancedTabsProvider({
  defaultTab = "",
  urlSync = false,
  persistPreferences = false,
  animationPreset = "smooth",
  swipeEnabled = true,
  keyboardShortcuts = true,
  onTabChange,
  children,
}: EnhancedTabsProviderProps) {
  // Animation presets
  const getAnimationConfig = (preset: string): AnimationConfig => {
    switch (preset) {
      case "fast":
        return {
          ...defaultAnimationConfig,
          duration: 150,
          transitions: {
            fadeIn: {
              ...defaultAnimationConfig.transitions.fadeIn,
              duration: 100,
            },
            slideIn: {
              ...defaultAnimationConfig.transitions.slideIn,
              duration: 150,
            },
            scaleIn: {
              ...defaultAnimationConfig.transitions.scaleIn,
              duration: 125,
            },
          },
        };
      case "minimal":
        return {
          ...defaultAnimationConfig,
          duration: 0,
          transitions: {
            fadeIn: {
              ...defaultAnimationConfig.transitions.fadeIn,
              duration: 0,
            },
            slideIn: {
              ...defaultAnimationConfig.transitions.slideIn,
              duration: 0,
            },
            scaleIn: {
              ...defaultAnimationConfig.transitions.scaleIn,
              duration: 0,
            },
          },
        };
      default: // 'smooth'
        return defaultAnimationConfig;
    }
  };

  // Initialize state
  const initialState: TabsState = {
    activeTab: defaultTab,
    previousTab: null,
    isTransitioning: false,
    loadedTabs: new Set(defaultTab ? [defaultTab] : []),
    preloadedTabs: new Set(),
    userPreferences: {
      ...defaultPreferences,
      lastActiveTab: defaultTab,
      swipeEnabled,
      keyboardShortcuts,
    },
    animationConfig: getAnimationConfig(animationPreset),
  };

  const [state, dispatch] = React.useReducer(tabsReducer, initialState);

  // Actions
  const actions = React.useMemo(
    () => ({
      switchTab: (tabId: string, options?: SwitchOptions) => {
        const previousTab = state.activeTab;
        dispatch({ type: "SWITCH_TAB", payload: { tabId, options } });

        // Handle transition timing
        if (
          !options?.skipAnimation &&
          state.userPreferences.preferredAnimations
        ) {
          dispatch({
            type: "SET_TRANSITION_STATE",
            payload: { isTransitioning: true },
          });

          setTimeout(() => {
            dispatch({
              type: "SET_TRANSITION_STATE",
              payload: { isTransitioning: false },
            });
          }, state.animationConfig.duration);
        }

        // Auto-preload adjacent tabs if enabled
        if (state.userPreferences.autoPreload && options?.preload !== false) {
          // This would be implemented with actual tab order logic
          // For now, we'll just mark the tab as preloaded
          dispatch({ type: "PRELOAD_TAB", payload: { tabId } });
        }

        // Call external callback
        if (onTabChange) {
          onTabChange(tabId, previousTab);
        }
      },

      preloadTab: (tabId: string) => {
        dispatch({ type: "PRELOAD_TAB", payload: { tabId } });
      },

      updatePreferences: (prefs: Partial<TabPreferences>) => {
        dispatch({
          type: "UPDATE_PREFERENCES",
          payload: { preferences: prefs },
        });
      },

      setAnimationConfig: (config: AnimationConfig) => {
        dispatch({ type: "SET_ANIMATION_CONFIG", payload: { config } });
      },
    }),
    [
      state.activeTab,
      state.animationConfig.duration,
      state.userPreferences.preferredAnimations,
      state.userPreferences.autoPreload,
      onTabChange,
    ],
  );

  // Context value
  const contextValue = React.useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions],
  );

  // Effect for URL synchronization
  React.useEffect(() => {
    if (urlSync && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const tabFromUrl = url.searchParams.get("tab");

      if (tabFromUrl && tabFromUrl !== state.activeTab) {
        actions.switchTab(tabFromUrl, {
          skipAnimation: true,
          updateHistory: false,
        });
      }
    }
  }, [urlSync, state.activeTab, actions]);

  // Effect to update URL when tab changes
  React.useEffect(() => {
    if (urlSync && typeof window !== "undefined") {
      const url = new URL(window.location.href);

      if (state.activeTab && state.activeTab !== defaultTab) {
        url.searchParams.set("tab", state.activeTab);
      } else {
        url.searchParams.delete("tab");
      }

      // Update URL without triggering navigation
      window.history.replaceState({}, "", url.toString());
    }
  }, [urlSync, state.activeTab, defaultTab]);

  // Effect for preference persistence
  React.useEffect(() => {
    if (persistPreferences && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "tabs-preferences",
          JSON.stringify(state.userPreferences),
        );
      } catch (error) {
        console.warn("Failed to persist tab preferences:", error);
      }
    }
  }, [persistPreferences, state.userPreferences]);

  // Load persisted preferences on mount
  React.useEffect(() => {
    if (persistPreferences && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tabs-preferences");
        if (stored) {
          const preferences = JSON.parse(stored);
          actions.updatePreferences(preferences);
        }
      } catch (error) {
        console.warn("Failed to load tab preferences:", error);
      }
    }
  }, [persistPreferences, actions]);

  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  );
}

// Legacy Tabs component for backward compatibility
function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internal_value, set_internal_value] = React.useState(defaultValue || "");
  const value = controlledValue ?? internal_value;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        set_internal_value(newValue);
      }

      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [controlledValue, onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
    }),
    [value, handleValueChange],
  );

  return (
    <LegacyTabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>{children}</div>
    </LegacyTabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const TabsTrigger = React.memo<TabsTriggerProps>(function TabsTrigger({
  value,
  children,
  className,
  disabled,
}) {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Performance monitoring for development
  React.useLayoutEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const start = performance.now();
      return () => {
        const end = performance.now();
        if (end - start > 16) {
          console.warn(
            `[TabsTrigger-${value}] Slow render: ${(end - start).toFixed(2)}ms`,
          );
        }
      };
    }
  });

  const handleClick = React.useCallback(() => {
    onValueChange(value);
  }, [onValueChange, value]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const tablist = event.currentTarget.closest('[role="tablist"]');
      if (!tablist) return;

      const tabs = Array.from(
        tablist.querySelectorAll('[role="tab"]'),
      ) as HTMLButtonElement[];
      const currentIndex = tabs.indexOf(event.currentTarget);

      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onValueChange(value);
          return;
        default:
          return;
      }

      // Focus the next tab
      tabs[nextIndex]?.focus();
    },
    [onValueChange, value],
  );

  const computedClassName = React.useMemo(
    () =>
      cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-background text-foreground shadow"
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className,
      ),
    [isSelected, className],
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      className={computedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
});

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent = React.memo<TabsContentProps>(function TabsContent({
  value,
  children,
  className,
}) {
  const { value: selectedValue } = useTabs();
  const isSelected = selectedValue === value;

  // Performance monitoring for development
  React.useLayoutEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const start = performance.now();
      return () => {
        const end = performance.now();
        if (end - start > 16) {
          console.warn(
            `[TabsContent-${value}] Slow render: ${(end - start).toFixed(2)}ms`,
          );
        }
      };
    }
  });

  const computedClassName = React.useMemo(
    () =>
      cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      ),
    [className],
  );

  if (!isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={computedClassName}
    >
      {children}
    </div>
  );
});

export {
  EnhancedTabsProvider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useEnhancedTabs,
  type AnimationConfig,
  type SwitchOptions,
  type TabPreferences,
  type TabsContextValue,
  type TabsState,
  type TransitionConfig,
};
