import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RideHistory = lazy(() => import("@/pages/Rider/RideHistory"));

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
    ],
  },
];
