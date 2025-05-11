import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
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
        url: "/get-all-services",
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
