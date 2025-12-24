import { lazy } from "react";
import type { ISidebarItem } from "@/types";
import Analytics from "@/pages/driver/analytics";

const RideHistory = lazy(() => import("@/pages/driver/ride-history"));
const Earnings = lazy(() => import("@/pages/driver/earnings"));

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/driver/analytics",
        component: Analytics,
      },
      {
        title: "Ride History",
        url: "/driver/ride-history",
        component: RideHistory,
      },
      {
        title: "Earnings",
        url: "/driver/earnings",
        component: Earnings,
      },
    ],
  },
];
