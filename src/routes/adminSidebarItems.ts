import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RideOversight = lazy(() => import("@/pages/Admin/RideOversight"));
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));
const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const DriverManagement = lazy(() => import("@/pages/Admin/DriverManagement"));

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
