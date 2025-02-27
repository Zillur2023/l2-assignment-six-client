"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
// import { useSearchParams } from "next/navigation";

const GoogleLogin = () => {
  // const searchParams = useSearchParams();

  // const redirect = searchParams.get("redirect");
  return (
    <Button
      onClick={() => {
        // signIn("google", { callbackUrl: redirect ? redirect : "/" });
        signIn("google", { callbackUrl: "http://localhost:3000" });
      }}
    >
      Log In With Google
    </Button>
  );
};

export default GoogleLogin;