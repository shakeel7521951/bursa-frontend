import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../Base_url";

export const OrderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ serviceId, data }) => ({
        url: `/create-order/${serviceId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: "/all-orders",
        method: "GET",
      }),
      providesTags: ["Order"], // ✅ Added
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, newStatus }) => ({
        url: `/update-order-status/${orderId}`,
        method: "PUT",
        body: { newStatus },
      }),
      invalidatesTags: ["Order"],
    }),

    myOrders: builder.query({
      query: () => ({
        url: "/my-orders",
        method: "GET",
      }),
      providesTags: ["Order"], // ✅ Added
    }),

    updateOrder: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `/update-order/${orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/delete-order/${orderId}`,
        method: "DELETE",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useMyOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = OrderApi;
