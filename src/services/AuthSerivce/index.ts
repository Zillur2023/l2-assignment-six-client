"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const setToken = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  cookies().set("accessToken", accessToken);
  cookies().set("refreshToken", refreshToken);
};

export const getUser = async () => {
  const token = cookies().get("accessToken")?.value;

  console.log("get accessToken from cookies ", token);

  let decodedToken = null;

  if (token) {
    decodedToken = await jwtDecode(token);
  }

  return decodedToken;
};

export const logout = async () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

export const getAccessToken = async () => {
  const result = cookies().get("accessToken")?.value;

  return result;
};
export const setAccessToken = async (token: string) => {
  const result = cookies().set("accessToken", token);

  return result;
};
