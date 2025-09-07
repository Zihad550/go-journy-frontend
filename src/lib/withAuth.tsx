import type { Role } from "@/constants";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import type { ObjectValues } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (
  Component: ComponentType,
  requiredRole?: ObjectValues<typeof Role>,
) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};
