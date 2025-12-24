import { baseApi, QueryTagType } from '@/redux/base-api';
import type {
  IApiResponse,
  IPayment,
  IPaymentInitiationResponse,
  IPaymentValidationResponse,
  IInvoiceDownloadResponse,
} from '@/types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initialize payment for a ride
    initPayment: builder.mutation<IApiResponse<IPaymentInitiationResponse>, string>({
      query: (rideId) => ({
        url: `/payment/init-payment/${rideId}`,
        method: 'POST',
      }),
      invalidatesTags: [QueryTagType.PAYMENT],
    }),

    // Get payment details by ID
    getPayment: builder.query<IApiResponse<IPayment>, string>({
      query: (paymentId) => ({
        url: `/payment/${paymentId}`,
        method: 'GET',
      }),
      providesTags: [QueryTagType.PAYMENT],
    }),

    // Download payment invoice
    downloadInvoice: builder.query<IInvoiceDownloadResponse, string>({
      query: (paymentId) => ({
        url: `/payment/invoice/${paymentId}`,
        method: 'GET',
      }),
      providesTags: [QueryTagType.PAYMENT],
    }),

    // Validate payment (IPN callback)
    validatePayment: builder.mutation<IApiResponse<IPaymentValidationResponse>, any>({
      query: (ipnData) => ({
        url: '/payment/validate-payment',
        method: 'POST',
        data: ipnData,
      }),
      invalidatesTags: [QueryTagType.PAYMENT],
    }),
  }),
});

export const {
  useInitPaymentMutation,
  useGetPaymentQuery,
  useDownloadInvoiceQuery,
  useValidatePaymentMutation,
} = paymentApi;