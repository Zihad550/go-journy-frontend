import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RideHistory = lazy(() => import("@/pages/Driver/RideHistory"));
const Earnings = lazy(() => import("@/pages/Driver/Earnings"));

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
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
