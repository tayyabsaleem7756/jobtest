import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./config";

export const api = createApi({
  baseQuery,
  reducerPath: "commonApi",
  tagTypes: [],
  endpoints: (build) => ({
    getCurrencies: build.query({
      query: () => `currencies/`,
    }),
    getAdminUsers: build.query({
      query: () => `admin_users/company`,
    }),
    getMeAdminUser: build.query<any, void>({
      query: () => `admin_users/me`,
    }),
   }),
});

export const { useGetCurrenciesQuery, useGetAdminUsersQuery, useGetMeAdminUserQuery } = api;
