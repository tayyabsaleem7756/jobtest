import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery} from "./config";
import {IOpportunity} from "../../pages/Opportunities/interfaces"
import {IActiveApplicationFund, IInvestedCount} from "../../interfaces/applicationStatus";


export const api = createApi({
  baseQuery,
  reducerPath: "tasksApi",
  tagTypes: ["userTasks", "userOpportunities", "userInProgressWorkflow", "investedCount", "activeApplications"],
  endpoints: (build) => ({
    getUserOpportunities: build.query<IOpportunity[], void>({
      query: () => `/investors/opportunities/`,
      providesTags: ["userOpportunities"],
    }),
    getInvestedCount: build.query<IInvestedCount, void>({
      query: () => `/investors/invested-count/`,
      providesTags: ["investedCount"],
    }),
    getActiveApplicationFund: build.query<IActiveApplicationFund[], void>({
      query: () => `/investors/active-applications/`,
      providesTags: ["activeApplications"],
    }),
    getUserTasks: build.query<any, void>({
      query: () => `/workflows/user-tasks/`,
      providesTags: ["userTasks"],
    }),
    getUserInProgressWorkflow: build.query<any, void>({
      query: () => `/workflows/user-tasks/in-progress`,
      providesTags: ["userInProgressWorkflow"],
    }),
  }),
});

export const {
  useGetUserTasksQuery,
  useGetUserOpportunitiesQuery,
  useGetUserInProgressWorkflowQuery,
  useGetInvestedCountQuery,
  useGetActiveApplicationFundQuery
} = api;
