import { baseApi } from '@/redux/baseApi';
import type { IApiResponse, IDriver } from '@/types';

export interface IDriverRegistration {
  vehicle: {
    name: string;
    model: string;
  };
  experience: number;
}

export interface IDriverStatusUpdate {
  driverStatus: 'pending' | 'approved' | 'rejected';
}

export interface IDriverAvailabilityUpdate {
  availability: 'online' | 'offline';
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query<IApiResponse<IDriver[]>, undefined>({
      query: () => ({
        url: '/drivers',
        method: 'GET',
      }),
      providesTags: ['DRIVER'],
    }),
    getDriverProfile: builder.query<IApiResponse<IDriver>, undefined>({
      query: () => ({
        url: '/drivers/profile',
        method: 'GET',
      }),
      providesTags: ['DRIVER'],
    }),
    registerDriver: builder.mutation<
      IApiResponse<IDriver>,
      IDriverRegistration
    >({
      query: (payload) => ({
        url: '/drivers/register',
        method: 'PATCH',
        data: payload,
      }),
      invalidatesTags: ['DRIVER'],
    }),
    manageDriverRegistration: builder.mutation<
      IApiResponse<IDriver>,
      { id: string; status: IDriverStatusUpdate }
    >({
      query: ({ id, status }) => ({
        url: `/drivers/manage-registration/${id}`,
        method: 'PATCH',
        data: status,
      }),
      invalidatesTags: ['DRIVER'],
    }),
    getDriverEarnings: builder.query<IApiResponse<unknown>, undefined>({
      query: () => ({
        url: '/drivers/earnings',
        method: 'GET',
      }),
      providesTags: ['DRIVER'],
    }),
    updateDriverAvailability: builder.mutation<
      IApiResponse<IDriver>,
      IDriverAvailabilityUpdate
    >({
      query: (payload) => ({
        url: '/drivers/availability',
        method: 'PATCH',
        data: payload,
      }),
      invalidatesTags: ['DRIVER'],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverProfileQuery,
  useRegisterDriverMutation,
  useManageDriverRegistrationMutation,
  useGetDriverEarningsQuery,
  useUpdateDriverAvailabilityMutation,
} = driverApi;
