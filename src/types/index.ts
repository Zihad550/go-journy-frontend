import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type * from "./admin-ride.type";
export type * from "./analytics-type";
export type * from "./api-type";
export type * from "./auth-type";
export type * from "./driver-type";
export type * from "./payment-type";
export type * from "./review-type";
export type * from "./ride-type";
export type * from "./user-type";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export interface IAchievement {
  metric: string;
  label: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}

// export type TGetTupleFromObj = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type ObjectValues<T> = T[keyof T];
