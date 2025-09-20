import { baseApi } from "@/redux/baseApi";
import type {
  IApiResponse,
  ILogin,
  IRegister,
  IRegisterResponse,
  ISendOtp,
  IVerifyOtp,
} from "@/types";

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
      invalidatesTags: ["RIDER"],
    }),
    register: builder.mutation<IApiResponse<IRegisterResponse>, IRegister>({
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
    sendOtp: builder.mutation<IApiResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/auth/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IApiResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/auth/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    refreshToken: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
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
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
} = authApi;
