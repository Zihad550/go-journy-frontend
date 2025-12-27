import { baseApi } from "@/redux/base-api";
import type {
  IApiResponse,
  IRide,
  IRideRequest,
  IRideStatusUpdate,
  IRideFilters,
} from "@/types";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRides: builder.query<IApiResponse<IRide[]>, undefined>({
      query: () => ({
        url: "/rides",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getAvailableRides: builder.query<IApiResponse<IRide[]>, IRideFilters>({
      query: (filters) => ({
        url: "/rides/available",
        method: "GET",
        params: filters,
      }),
      providesTags: ["RIDE"],
    }),
    getRideById: builder.query<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    requestRide: builder.mutation<IApiResponse<IRide>, IRideRequest>({
      query: (payload) => ({
        url: "/rides/request",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RIDE"],
    }),
    acceptRide: builder.mutation<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/accept/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    updateRideStatus: builder.mutation<
      IApiResponse<IRide>,
      { id: string; status: IRideStatusUpdate }
    >({
      query: ({ id, status }) => ({
        url: `/rides/${id}/status`,
        method: "PATCH",
        data: status,
      }),
      invalidatesTags: ["RIDE"],
    }),
    cancelRide: builder.mutation<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    showInterest: builder.mutation<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/interested/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    acceptDriver: builder.mutation<
      IApiResponse<IRide>,
      { rideId: string; driverId: string }
    >({
      query: ({ rideId, driverId }) => ({
        url: `/rides/accept/${rideId}`,
        method: "PATCH",
        data: { driverId },
      }),
      invalidatesTags: ["RIDE"],
    }),
  }),
});

export const {
  useGetRidesQuery,
  useGetRideByIdQuery,
  useGetAvailableRidesQuery,
  useRequestRideMutation,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useCancelRideMutation,
  useShowInterestMutation,
  useAcceptDriverMutation,
} = rideApi;
