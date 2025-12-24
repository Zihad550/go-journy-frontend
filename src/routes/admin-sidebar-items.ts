import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RideOversight = lazy(() => import("@/pages/admin/ride-oversight"));
const UserManagement = lazy(() => import("@/pages/admin/user-management"));
const Analytics = lazy(() => import("@/pages/admin/analytics"));
const DriverManagement = lazy(() => import("@/pages/admin/driver-management"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
      {
        title: "Ride Oversight",
        url: "/admin/ride-oversight",
        component: RideOversight,
      },
      {
        title: "User Management",
        url: "/admin/user-management",
        component: UserManagement,
      },
      {
        title: "Driver Registration Management",
        url: "/admin/driver-management",
        component: DriverManagement,
      },
    ],
  },
];
