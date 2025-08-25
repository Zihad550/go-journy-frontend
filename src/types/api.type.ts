import type { BaseQueryApi } from "@reduxjs/toolkit/query";

export interface IApiErrorResponse {
  message: string;
  stack?: string;
  success: boolean;
  status: number;
}

export interface IMeta {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

export interface IResponse<T> {
  data?: T;
  meta?: IMeta;
  success: boolean;
  message: string;
}

export interface IApiResponse<T> extends IResponse<T>, BaseQueryApi {}

export interface IQueryParam {
  name: string;
  value: boolean | React.Key;
}
