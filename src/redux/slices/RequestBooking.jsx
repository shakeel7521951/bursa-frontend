import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../Base_url";

export const acceptRequestApi = createApi({
  reducerPath: "acceptRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["AcceptRequest"],

  endpoints: (builder) => ({
    // ✅ Mutation to accept a request
    acceptTransportRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `/create-request-booking/${requestId}`,
        method: "POST",
      }),
      invalidatesTags: ["AcceptRequest"],
    }),

    updateRequestStatus: builder.mutation({
      query: (requestId) => ({
        url: `/mark-fulfilled/${requestId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["AcceptRequest"], // This refetches the updated list
    }),

    // ✅ Query to get accepted requests for logged-in transporter
    getAcceptedTransporterRequests: builder.query({
      query: () => `/transporter-accepted-requests`,
      providesTags: ["AcceptRequest"],
    }),
  }),
});

export const {
  useAcceptTransportRequestMutation,
  useGetAcceptedTransporterRequestsQuery,
  useUpdateRequestStatusMutation,
} = acceptRequestApi;
