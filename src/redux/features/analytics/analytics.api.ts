import { baseApi } from "@/redux/baseApi";
import type {
  IApiResponse,
  IDriverAnalytics,
  IDriverAnalyticsParams,
  IRiderAnalytics,
  IRiderAnalyticsParams,
} from "@/types";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiderAnalytics: builder.query<
      IApiResponse<IRiderAnalytics>,
      IRiderAnalyticsParams | undefined
    >({
      query: (params) => ({
        url: "/analytics/rider-analytics",
        method: "GET",
        params,
      }),
      providesTags: ["ANALYTICS"],
    }),
    getDriverAnalytics: builder.query<
      IApiResponse<IDriverAnalytics>,
      IDriverAnalyticsParams | undefined
    >({
      query: (params) => ({
        url: "/analytics/driver-analytics",
        method: "GET",
        params,
      }),
      providesTags: ["ANALYTICS"],
    }),
  }),
});

export const { useGetDriverAnalyticsQuery, useGetRiderAnalyticsQuery } =
  analyticsApi;
