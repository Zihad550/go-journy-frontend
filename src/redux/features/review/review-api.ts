import { baseApi } from "@/redux/base-api";
import type { IFeaturedReviewsResponse, IApiResponse, IRiderReview } from "@/types";

export interface IGetRiderReviewsParams {
  page?: number;
  limit?: number;
}

export interface IUpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface ICreateReviewRequest {
  ride: string;
  rating: number;
  comment?: string;
}

export interface ICreateReviewResponse {
  _id: string;
  rider: { name: string; email: string };
  driver: {
    _id: string;
    user: { name: string; email: string };
    vehicle: { name: string; model: string };
  };
  ride: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedReviews: builder.query<IFeaturedReviewsResponse, void>({
      query: () => ({
        url: "/reviews/featured",
        method: "GET",
      }),
      providesTags: ["REVIEW"],
    }),
    getRiderReviews: builder.query<IApiResponse<IRiderReview[]>, IGetRiderReviewsParams | undefined>({
      query: (params) => ({
        url: "/reviews/my-reviews",
        method: "GET",
        params,
      }),
      providesTags: ["REVIEW"],
    }),
    createReview: builder.mutation<
      IApiResponse<ICreateReviewResponse>,
      ICreateReviewRequest
    >({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        data: reviewData,
      }),
      invalidatesTags: ["REVIEW"],
    }),
    updateReview: builder.mutation<
      IApiResponse<IRiderReview>,
      { id: string; data: IUpdateReviewRequest }
    >({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["REVIEW"],
    }),
    deleteReview: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["REVIEW"],
    }),
  }),
});

export const {
  useGetFeaturedReviewsQuery,
  useGetRiderReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
