import { baseApi } from '@/redux/baseApi';
import type {
  IApiResponse,
  IRide,
  IRideRequest,
  IRideStatusUpdate,
} from '@/types';

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRides: builder.query<IApiResponse<IRide[]>, undefined>({
      query: () => ({
        url: '/rides',
        method: 'GET',
      }),
      providesTags: ['RIDE'],
    }),
    getRideById: builder.query<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/${id}`,
        method: 'GET',
      }),
      providesTags: ['RIDE'],
    }),
    requestRide: builder.mutation<IApiResponse<IRide>, IRideRequest>({
      query: (payload) => ({
        url: '/rides/request',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['RIDE'],
    }),
    acceptRide: builder.mutation<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/accept/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['RIDE'],
    }),
    updateRideStatus: builder.mutation<
      IApiResponse<IRide>,
      { id: string; status: IRideStatusUpdate }
    >({
      query: ({ id, status }) => ({
        url: `/rides/${id}/status`,
        method: 'PATCH',
        data: status,
      }),
      invalidatesTags: ['RIDE'],
    }),
    cancelRide: builder.mutation<IApiResponse<IRide>, string>({
      query: (id) => ({
        url: `/rides/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['RIDE'],
    }),
  }),
});

export const {
  useGetRidesQuery,
  useGetRideByIdQuery,
  useRequestRideMutation,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useCancelRideMutation,
} = rideApi;
