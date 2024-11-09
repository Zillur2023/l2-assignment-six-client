/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    BaseQueryApi,
    BaseQueryFn,
    createApi,
    DefinitionType,
    FetchArgs,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl:  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set("authorization", `${token}`);
    }
    
    return headers;
  },
});


const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result:any = await baseQuery(args, api, extraOptions);

  // if (result?.error?.data?.err?.statusCode === 401) {
  // if (result?.error?.status === 404) {
  //   toast.error('User not found')
  // }
  // if (result?.error?.status === 403) {
  //   toast.error('Password not match')
  // }

  if (result?.error?.status === 401) {
    //* Send Refresh

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   BaseQueryApi,
//   BaseQueryFn,
//   createApi,
//   DefinitionType,
//   FetchArgs,
//   fetchBaseQuery,
// } from "@reduxjs/toolkit/query/react";
// import { getAccessToken, logout } from "@/services/AuthSerivce";

// const baseQuery = fetchBaseQuery({
//   baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,

  
//   credentials: "include",
//   prepareHeaders: async(headers) => {
//    try {
//     const accessToken = await  getAccessToken()


//     if (accessToken) {
//       headers.set("authorization", `${accessToken}`);
//     }
//    } catch (error:any) {
//     console.log({error})
//    }

//     return headers;
//   },
// });

// console.log("process.env.SERVER_URL",process.env.NEXT_PUBLIC_SERVER_URL)

// const baseQueryWithRefreshToken: BaseQueryFn<
//   FetchArgs,
//   BaseQueryApi,
//   DefinitionType
// > = async (args, api, extraOptions): Promise<any> => {
//   let result: any = await baseQuery(args, api, extraOptions);

//   // if (result?.error?.data?.err?.statusCode === 401) {
//   // if (result?.error?.status === 404) {
//   //   toast.error('User not found')
//   // }
//   // if (result?.error?.status === 403) {
//   //   toast.error('Password not match')
//   // }
 

//   if (result?.error?.status === 401) {
//     //* Send Refresh
//     console.log("Sending refresh token");

//     try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`, {
//       method: "POST",
//       credentials: "include",
//     });


//     if (res.ok) {
//       // If the refresh was successful, proceed with baseQuery
//        result = await baseQuery(args, api, extraOptions);
//   } else {
//       // If the refresh failed, log the user out
//       await logout();
//   }
// } catch (error) {
//   console.error("Network or fetch error:", error);
//   // Handle network or fetch errors here, possibly log out as well
//   await logout();
// }

   
   
    
//   }

//   return result;
// };

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   tagTypes: ["User", "Post", "Comment"],
//   baseQuery: baseQueryWithRefreshToken,
//   // baseQuery,
//   endpoints: () => ({}),
// });
