import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../Base_url";

export const BlogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Blog"],

  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (data) => ({
        url: "/add-blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    //  Get all blogs
    getAllBlogs: builder.query({
      query: () => ({
        url: "/get-all-blogs",
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getSingleBlog: builder.query({
      query: (blogId) => ({
        url: `/get-single-blog/${blogId}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Delete a blog
    deleteBlog: builder.mutation({
      query: ({ blogId }) => ({
        url: `/delete-blog/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Update a blog
    updateBlog: builder.mutation({
      query: ({ data, blogId }) => ({
        url: `/update-blog/${blogId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Add a comment to a blog
    addComment: builder.mutation({
      query: ({ blogId, commentText }) => ({
        url: `/add-comment/${blogId}`,
        method: "POST",
        body: { commentText }, // Send as an object
      }),
      invalidatesTags: ["Blog"],
    }),

    // Like a blog
    likeBlog: builder.mutation({
      query: ({ blogId }) => ({
        url: `/blog/${blogId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Like a comment
    likeComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `/blogs/${blogId}/comments/${commentId}/like`, // Updated URL
        method: "PUT",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useAddCommentMutation,
  useLikeBlogMutation,
  useLikeCommentMutation,
} = BlogApi;
