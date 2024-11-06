/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { getAccessToken, logout } from "@/services/AuthSerivce";

const baseQuery = fetchBaseQuery({
  // baseUrl: `${config.server_url}/api`,
  baseUrl: `http://localhost:5000/api/v1`,
  // baseUrl: `https://l2-assignment-six-server.vercel.app/api/v1`,

  credentials: "include",
  prepareHeaders: async(headers) => {
   try {
    const accessToken = await  getAccessToken()
    console.log({accessToken})

    if (accessToken) {
      headers.set("authorization", `${accessToken}`);
    }
   } catch (error:any) {
    console.log({error})
   }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result: any = await baseQuery(args, api, extraOptions);

  // if (result?.error?.data?.err?.statusCode === 401) {
  // if (result?.error?.status === 404) {
  //   toast.error('User not found')
  // }
  // if (result?.error?.status === 403) {
  //   toast.error('Password not match')
  // }
  console.log("result?.error?.status === 401", result?.error?.status === 401);

  if (result?.error?.status === 401) {
    //* Send Refresh
    console.log("Sending refresh token");

    try {
       // const res = await fetch(`${config.server_url}/api/auth/refresh-token`, {
    const res = await fetch(`http://localhost:5000/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    console.log({res})

    if (res.ok) {
      // If the refresh was successful, proceed with baseQuery
       result = await baseQuery(args, api, extraOptions);
  } else {
      // If the refresh failed, log the user out
      await logout();
  }
} catch (error) {
  console.error("Network or fetch error:", error);
  // Handle network or fetch errors here, possibly log out as well
  await logout();
}

   
   
    
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Post", "Comment"],
  baseQuery: baseQueryWithRefreshToken,
  // baseQuery,
  endpoints: () => ({}),
});
