import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface UseTabsURLOptions {
  paramName?: string;
  validTabs?: string[];
  defaultTab?: string;
  replaceHistory?: boolean;
}

interface UseTabsURLReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isValidTab: (tab: string) => boolean;
}

/**
 * Custom hook for URL synchronization with tabs
 * Manages tab state through URL parameters for shareable tab states
 */
export function useTabsURL({
  paramName = 'tab',
  validTabs = [],
  defaultTab = '',
  replaceHistory = false,
}: UseTabsURLOptions = {}): UseTabsURLReturn {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse current tab from URL
  const getTabFromURL = useCallback((): string => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(paramName);

    // Return tab from URL if it's valid, otherwise return default
    if (
      tabFromUrl &&
      (validTabs.length === 0 || validTabs.includes(tabFromUrl))
    ) {
      return tabFromUrl;
    }

    return defaultTab;
  }, [location.search, paramName, validTabs, defaultTab]);

  // Initialize state with tab from URL
  const [activeTab, setActiveTabState] = useState<string>(getTabFromURL);

  // Validate if a tab is allowed
  const isValidTab = useCallback(
    (tab: string): boolean => {
      return validTabs.length === 0 || validTabs.includes(tab);
    },
    [validTabs]
  );

  // Update URL when tab changes
  const setActiveTab = useCallback(
    (tab: string) => {
      // Validate tab before setting
      if (!isValidTab(tab)) {
        console.warn(`Invalid tab "${tab}". Valid tabs are:`, validTabs);
        return;
      }

      // Update local state
      setActiveTabState(tab);

      // Update URL
      const searchParams = new URLSearchParams(location.search);

      if (tab === defaultTab) {
        // Remove parameter if it's the default tab
        searchParams.delete(paramName);
      } else {
        // Set parameter for non-default tabs
        searchParams.set(paramName, tab);
      }

      const newSearch = searchParams.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;

      // Navigate with or without replacing history
      navigate(newPath, { replace: replaceHistory });
    },
    [
      isValidTab,
      validTabs,
      location.search,
      location.pathname,
      paramName,
      defaultTab,
      replaceHistory,
      navigate,
    ]
  );

  // Sync state with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = getTabFromURL();
    if (tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [getTabFromURL, activeTab]);

  // Handle invalid tabs in URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(paramName);

    // If there's a tab in URL but it's invalid, redirect to default
    if (tabFromUrl && !isValidTab(tabFromUrl)) {
      console.warn(
        `Invalid tab "${tabFromUrl}" in URL. Redirecting to default tab.`
      );
      setActiveTab(defaultTab);
    }
  }, [location.search, paramName, isValidTab, defaultTab, setActiveTab]);

  return {
    activeTab,
    setActiveTab,
    isValidTab,
  };
}
