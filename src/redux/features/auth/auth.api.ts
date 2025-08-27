import { baseApi } from "@/redux/baseApi";
import type { IApiResponse, ILogin, IRegister } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IApiResponse<null>, ILogin>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    register: builder.mutation<IApiResponse<null>, IRegister>({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    forgotPassword: builder.mutation<IApiResponse<null>, { email: string }>({
      query: (userInfo) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: userInfo,
      }),
    }),
    resetPassword: builder.mutation<
      IApiResponse<null>,
      { newPassword: string; token: string }
    >({
      query: (userInfo) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        data: { newPassword: userInfo.newPassword },
        headers: {
          Authorization: userInfo.token,
        },
      }),
    }),
    changePassword: builder.mutation<
      IApiResponse<null>,
      { newPassword: string; oldPassword: string }
    >({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "PATCH",
        data: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
