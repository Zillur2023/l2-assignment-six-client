"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const getUser = async () => {
  const token = cookies().get("refreshToken")?.value;

  let decodedToken = null;

  if (token) {
    decodedToken = await jwtDecode(token);
  }

  return decodedToken;
};

// export const logout = (): Promise<void> => {
//   return new Promise((resolve) => {
//     cookies().delete("accessToken");  // Perform the deletion
//     resolve();  // Immediately resolve the promise
//   });
// };

export const logout = async () => {
  // cookies().delete("accessToken");
  cookies().delete("refreshToken");
};
