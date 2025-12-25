import Analytics from "@/pages/rider/analytics";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RideHistory = lazy(() => import("@/pages/rider/ride-history"));
const MyReviews = lazy(() => import("@/pages/rider/my-reviews"));

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/rider/analytics",
        component: Analytics,
      },
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
      {
        title: "My Reviews",
        url: "/rider/my-reviews",
        component: MyReviews,
      },
    ],
  },
];
