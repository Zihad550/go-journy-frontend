import { Role } from "@/constants";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { driverSidebarItems } from "@/routes/driverSidebarItemsk";
import { riderSidebarItems } from "@/routes/riderSidebarItems";
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
