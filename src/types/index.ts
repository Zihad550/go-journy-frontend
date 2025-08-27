import type { ComponentType } from "react";

export type * from "./api.type";
export type * from "./auth.type";
export type * from "./driver.type";
export type * from "./user.type";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
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
export type TGetUnionFromObj<T> = T[keyof T];
