import { baseApi } from "@/redux/baseApi";
import type { IApiResponse, IUser } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userInfo: builder.query<IApiResponse<IUser>, undefined>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    updateUser: builder.mutation<IApiResponse<IUser>, { name: string }>({
      query: (payload) => ({
        url: "/users/profile",
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { useUserInfoQuery, useUpdateUserMutation } = userApi;
