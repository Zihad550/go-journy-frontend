import { baseApi, QueryTagType } from "@/redux/baseApi";
import type {
  IAddNotePayload,
  IAdminRide,
  IAdminRideAnalytics,
  IAdminRideOverview,
  IApiResponse,
  IAssignDriverPayload,
  IDriverHistory,
  IDriverHistoryParams,
  IForceDeletePayload,
  IRideAnalyticsParams,
  IRideIssues,
  IRideIssuesParams,
  IRideOverviewParams,
  IStatusUpdatePayload,
  IUser,
} from "@/types";

// Analytics types
export interface IAnalyticsOverview {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  totalRevenue: number;
  activeDrivers: number;
  completedRides: number;
  pendingRides: number;
  cancelledRides: number;
}

export interface IDriverAnalytics {
  driversByStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  driversByAvailability: {
    online: number;
    offline: number;
  };
  topDriversByRides: Array<{
    driverId: string;
    driverName: string;
    totalRides: number;
    earnings: number;
  }>;
}

export interface IRideAnalytics {
  ridesByStatus: {
    requested: number;
    accepted: number;
    in_transit: number;
    completed: number;
    cancelled: number;
  };
  ridesByTimeOfDay: Array<{
    hour: number;
    count: number;
  }>;
  averageRidePrice: number;
  totalDistance: number;
}

export interface ITrendPoint {
  date: string;
  value: number;
  label?: string;
}

export interface IRevenueTrend {
  daily: ITrendPoint[];
  weekly: ITrendPoint[];
  monthly: ITrendPoint[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<IApiResponse<IAnalyticsOverview>, void>({
      query: () => ({
        url: "/analytics/admin/overview",
        method: "GET",
      }),
      providesTags: [QueryTagType.ANALYTICS],
    }),

    getAdminDriverAnalytics: builder.query<
      IApiResponse<IDriverAnalytics>,
      void
    >({
      query: () => ({
        url: "/analytics/admin/drivers",
        method: "GET",
      }),
      providesTags: [QueryTagType.ANALYTICS, QueryTagType.DRIVER],
    }),

    getRideAnalytics: builder.query<IApiResponse<IRideAnalytics>, void>({
      query: () => ({
        url: "/analytics/admin/rides",
        method: "GET",
      }),
      providesTags: [QueryTagType.ANALYTICS, QueryTagType.RIDE],
    }),

    getRevenueTrend: builder.query<
      IApiResponse<IRevenueTrend>,
      { period?: "daily" | "weekly" | "monthly"; days?: number }
    >({
      query: ({ period = "daily", days = 30 } = {}) => ({
        url: "/analytics/admin/revenue-trend",
        method: "GET",
        params: { period, days },
      }),
      providesTags: [QueryTagType.ANALYTICS],
    }),

    // Admin Ride Oversight Endpoints
    getAdminRideOverview: builder.query<
      IApiResponse<IAdminRideOverview>,
      IRideOverviewParams
    >({
      query: (params) => ({
        url: "/rides/admin/overview",
        method: "GET",
        params,
      }),
      providesTags: [QueryTagType.RIDE],
    }),

    getAdminRideAnalytics: builder.query<
      IApiResponse<IAdminRideAnalytics>,
      IRideAnalyticsParams
    >({
      query: (params) => ({
        url: "/analytics/admin/rides",
        method: "GET",
        params,
      }),
      providesTags: [QueryTagType.RIDE],
    }),

    getActiveRides: builder.query<IApiResponse<IAdminRide[]>, void>({
      query: () => ({
        url: "/rides/admin/active",
        method: "GET",
      }),
      providesTags: [QueryTagType.RIDE],
    }),

    getRideIssues: builder.query<IApiResponse<IRideIssues>, IRideIssuesParams>({
      query: (params) => ({
        url: "/rides/admin/issues",
        method: "GET",
        params,
      }),
      providesTags: [QueryTagType.RIDE],
    }),

    getDriverHistory: builder.query<
      IApiResponse<IDriverHistory>,
      { driverId: string } & IDriverHistoryParams
    >({
      query: ({ driverId, ...params }) => ({
        url: `/rides/admin/driver/${driverId}/history`,
        method: "GET",
        params,
      }),
      providesTags: [QueryTagType.RIDE, QueryTagType.DRIVER],
    }),

    updateAdminRideStatus: builder.mutation<
      IApiResponse<IAdminRide>,
      { id: string } & IStatusUpdatePayload
    >({
      query: ({ id, ...payload }) => ({
        url: `/rides/admin/${id}/status`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [QueryTagType.RIDE],
    }),

    assignDriverToRide: builder.mutation<
      IApiResponse<IAdminRide>,
      { id: string } & IAssignDriverPayload
    >({
      query: ({ id, ...payload }) => ({
        url: `/rides/admin/${id}/assign-driver`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [QueryTagType.RIDE, QueryTagType.DRIVER],
    }),

    addAdminNote: builder.mutation<
      IApiResponse<IAdminRide>,
      { id: string } & IAddNotePayload
    >({
      query: ({ id, ...payload }) => ({
        url: `/rides/admin/${id}/note`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [QueryTagType.RIDE],
    }),

    forceDeleteRide: builder.mutation<
      IApiResponse<{ message: string; deletedRide: any }>,
      { id: string } & IForceDeletePayload
    >({
      query: ({ id, ...payload }) => ({
        url: `/rides/admin/${id}/force-delete`,
        method: "DELETE",
        data: payload,
      }),
      invalidatesTags: [QueryTagType.RIDE],
    }),

    // User Management Endpoints
    getAllUsers: builder.query<
      IApiResponse<IUser[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: [QueryTagType.USER],
    }),

    blockUser: builder.mutation<IApiResponse<IUser>, { id: string }>({
      query: ({ id }) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [QueryTagType.USER],
    }),

    updateUser: builder.mutation<
      IApiResponse<IUser>,
      { id: string; name?: string; isActive?: string; role?: string }
    >({
      query: ({ id, ...payload }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [QueryTagType.USER],
    }),

    deleteUser: builder.mutation<
      IApiResponse<{ message: string }>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [QueryTagType.USER],
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetAdminDriverAnalyticsQuery,
  useGetRideAnalyticsQuery,
  useGetRevenueTrendQuery,
  // Admin ride oversight hooks
  useGetAdminRideOverviewQuery,
  useGetAdminRideAnalyticsQuery,
  useGetActiveRidesQuery,
  useGetRideIssuesQuery,
  useGetDriverHistoryQuery,
  useUpdateAdminRideStatusMutation,
  useAssignDriverToRideMutation,
  useAddAdminNoteMutation,
  useForceDeleteRideMutation,
  // User management hooks
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
