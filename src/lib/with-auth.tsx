import { Role } from "@/constants";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import type { ObjectValues } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (
  Component: ComponentType,
  requiredRole?: ObjectValues<typeof Role> | ObjectValues<typeof Role>[],
) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading) {
      const userRole = data?.data?.role;
      if (!userRole) {
        return <Navigate to="/unauthorized" />;
      }
      const allowed = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole as ObjectValues<typeof Role>)
        : requiredRole === userRole || (requiredRole === Role.ADMIN && userRole === Role.SUPER_ADMIN);
      if (!allowed) {
        return <Navigate to="/unauthorized" />;
      }
    }

    return <Component />;
  };
};
