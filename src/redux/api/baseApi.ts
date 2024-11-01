import { logoutFromLocalStore } from "@/services/AuthSerivce";
import { logoutFromRedux, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";
import { BaseQueryApi, BaseQueryFn, createApi, DefinitionType, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({
  // baseUrl: `${config.server_url}/api`,
  baseUrl: `http://localhost:5000/api/v1`,
  // baseUrl: `https://l2-assignment-six-server.vercel.app/api/v1`,
  
  
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
  console.log("result?.",result )
  

    if ((result?.error?.status === 401)) {
      //* Send Refresh
      console.log('Sending refresh token');
  
      // const res = await fetch(`${config.server_url}/api/auth/refresh-token`, {
      const res = await fetch(`http://localhost:5000/api/v1/auth/refresh-token`, {
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
        api.dispatch(logoutFromRedux());
        logoutFromLocalStore()
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
