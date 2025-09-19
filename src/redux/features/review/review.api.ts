import { baseApi } from "@/redux/baseApi";
import type { IFeaturedReviewsResponse, IApiResponse } from "@/types";

// Review creation types
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
    createReview: builder.mutation<IApiResponse<ICreateReviewResponse>, ICreateReviewRequest>({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        data: reviewData,
      }),
      invalidatesTags: ["REVIEW"],
    }),
  }),
});

export const { useGetFeaturedReviewsQuery, useCreateReviewMutation } = reviewApi;