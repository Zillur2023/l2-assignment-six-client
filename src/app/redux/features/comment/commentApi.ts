import { baseApi } from "../../api/baseApi";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createComment: builder.mutation({
        query: (commentData) => ({
          url: '/comment/create',
          method: 'POST',
          body: commentData,
        }),
        invalidatesTags: ["Comment"]
      }),
    }),
  });
  
  export const { useCreateCommentMutation } = authApi;