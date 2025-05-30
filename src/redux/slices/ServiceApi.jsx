import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../Base_url";

export const serviceApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (newService) => ({
        url: "/create-service",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: ["Service"],
    }),
    getAllServices: builder.query({
      query: () => ({
        url: "/get-all-services",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    getIndividualServices: builder.query({
      query: () => ({
        url: "/get-individual-services",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update-service/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/delete-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetAllServicesQuery,
  useGetIndividualServicesQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
