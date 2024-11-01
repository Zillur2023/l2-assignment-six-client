'use server'
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";


export const getUser = async() => {
  const token = cookies().get("refreshToken")?.value;

   let user = null;

  if(token) {
    user = await jwtDecode(token)
  }

  return await user
}

// export const logoutFromLocalStore = (): Promise<void> => {
//   return new Promise((resolve) => {
//     cookies().delete("accessToken");  // Perform the deletion
//     resolve();  // Immediately resolve the promise
//   });
// };

export const logoutFromLocalStore = async() => {
    // cookies().delete("accessToken");
    cookies().delete("refreshToken");
  };