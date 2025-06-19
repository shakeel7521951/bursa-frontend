import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../Base_url";

export const transportRequestApi = createApi({
  reducerPath: "transportRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["TransportRequest"],

  endpoints: (builder) => ({
    // Create Transport Request
    createTransportRequest: builder.mutation({
      query: (formData) => ({
        url: "/transport-request",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["TransportRequest"],
    }),

    // Get All Transport Requests
    getAllTransportRequests: builder.query({
      query: () => "/get-all-requests",
      providesTags: ["TransportRequest"],
    }),
    // Get user Transport Requests
    getUserTransportRequests: builder.query({
      query: () => "/get-user-requests",
      providesTags: ["TransportRequest"],
    }),

    // Update Transport Request
    updateTransportRequest: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/update-request/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["TransportRequest"],
    }),

    // Delete Transport Request
    deleteTransportRequest: builder.mutation({
      query: (id) => ({
        url: `/delete-request/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportRequest"],
    }),
  }),
});

export const {
  useCreateTransportRequestMutation,
  useGetAllTransportRequestsQuery,
  useGetUserTransportRequestsQuery,
  useUpdateTransportRequestMutation,
  useDeleteTransportRequestMutation,
} = transportRequestApi;
