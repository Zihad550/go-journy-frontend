import { Role } from "@/constants";
import { adminSidebarItems } from "@/routes/admin-sidebar-items";
import { driverSidebarItems } from "@/routes/driver-sidebar-itemsk";
import { riderSidebarItems } from "@/routes/rider-sidebar-items";
import type { ObjectValues } from "@/types";

export const getSidebarItems = (userRole: ObjectValues<typeof Role>) => {
  switch (userRole) {
    case Role.SUPER_ADMIN:
      return [...adminSidebarItems];
    case Role.ADMIN:
      return [...adminSidebarItems];
    case Role.RIDER:
      return [...riderSidebarItems];
    case Role.DRIVER:
      return [...driverSidebarItems];
    default:
      return [];
  }
};
