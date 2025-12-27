import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface UseTabsURLOptions {
  paramName?: string;
  validTabs?: string[];
  defaultTab?: string;
  replaceHistory?: boolean;
}

interface UseTabsURLReturn {
  active_tab: string;
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

  const getTabFromURL = useCallback((): string => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(paramName);

    if (
      tabFromUrl &&
      (validTabs.length === 0 || validTabs.includes(tabFromUrl))
    ) {
      return tabFromUrl;
    }

    return defaultTab;
  }, [location.search, paramName, validTabs, defaultTab]);

  const [active_tab, set_active_tab_state] = useState<string>(getTabFromURL);

  const isValidTab = useCallback(
    (tab: string): boolean => {
      return validTabs.length === 0 || validTabs.includes(tab);
    },
    [validTabs]
  );

  const setActiveTab = useCallback(
    (tab: string) => {
      if (!isValidTab(tab)) {
        console.warn(`Invalid tab "${tab}". Valid tabs are:`, validTabs);
        return;
      }

      set_active_tab_state(tab);

      const searchParams = new URLSearchParams(location.search);

      if (tab === defaultTab) {
        searchParams.delete(paramName);
      } else {
        searchParams.set(paramName, tab);
      }

      const newSearch = searchParams.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;

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

  useEffect(() => {
    const tabFromUrl = getTabFromURL();
    if (tabFromUrl !== active_tab) {
      set_active_tab_state(tabFromUrl);
    }
  }, [getTabFromURL, active_tab]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(paramName);

    if (tabFromUrl && !isValidTab(tabFromUrl)) {
      console.warn(
        `Invalid tab "${tabFromUrl}" in URL. Redirecting to default tab.`
      );
      setActiveTab(defaultTab);
    }
  }, [location.search, paramName, isValidTab, defaultTab, setActiveTab]);

  return {
    active_tab,
    setActiveTab,
    isValidTab,
  };
}
