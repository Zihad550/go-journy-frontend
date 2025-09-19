import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const QueryTagType = {
  RIDER: "RIDER",
  RIDE: "RIDE",
  DRIVER: "DRIVER",
  ANALYTICS: "ANALYTICS",
  REVIEW: "REVIEW",
  PAYMENT: "PAYMENT",
  USER: "USER",
} as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: Object.values(QueryTagType),
  endpoints: () => ({}),
});
