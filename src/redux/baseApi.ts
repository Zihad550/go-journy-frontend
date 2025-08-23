import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const QueryTagType = {
  USER: "USER",
} as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: Object.values(QueryTagType),
  endpoints: () => ({}),
});
