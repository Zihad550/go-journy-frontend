import { useCallback } from "react";
import { ACCESSIBILITY_CONFIG } from "@/components/modules/home/constants/how-it-works-section-constants";

export function useTabAccessibility() {
  const announceTabChange = useCallback((tabValue: string) => {
    const announcement = `Switched to ${
      tabValue === "rider" ? "rider" : "driver"
    } process steps`;

    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = announcement;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, ACCESSIBILITY_CONFIG.announcementDelay);
  }, []);

  const createTabChangeHandler = useCallback(
    (setActiveTab: (tab: string) => void) => {
      return (newTab: string) => {
        setActiveTab(newTab);
        announceTabChange(newTab);
      };
    },
    [announceTabChange],
  );

  return {
    createTabChangeHandler,
    announceTabChange,
  };
}
