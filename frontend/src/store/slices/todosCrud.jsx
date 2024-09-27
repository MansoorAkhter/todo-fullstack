// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const todosCrud = createApi({
  reducerPath: "todos",
  tagTypes: ["REFTECH"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),

  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => `todos`,
      providesTags: ["REFTECH"],
    }),
    getById: builder.query({
      query: (id) => `todos/${id}`,
    }),
    create: builder.mutation({
      query: (data) => ({
        url: `todos`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["REFTECH"],
    }),
    updById: builder.mutation({
      query: ({ id, data }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["REFTECH"],
    }),
    deleteById: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["REFTECH"],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useUpdByIdMutation,
  useCreateMutation,
  useDeleteByIdMutation,
} = todosCrud;
