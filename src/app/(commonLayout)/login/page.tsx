/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useForgetPasswordMutation, useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import CustomForm from "@/components/form/CustomForm";
import CustomInput from "@/components/form/CustomInput";
import { Button } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "@/schemas";
import GoogleLogin from "@/components/shared/GoogleLogin";
import { useGetUserQuery } from "@/redux/features/user/userApi";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [forgetPassword] = useForgetPasswordMutation()

  const methods = useForm({
    resolver: zodResolver(loginValidationSchema), // Pass the Zod resolver here
  });

  const { handleSubmit, watch } = methods;

  const emailValue = watch("email");

  // Run the query only if emailValue is not null or empty
  const { data: user } = useGetUserQuery(emailValue, {
    skip: !emailValue,
  });
  // console.log("loginUSerrrr.user", user)
  // console.log("loginUSerrrr.roleeee", user?.data?.email)
  // console.log("loginUSerrrremailValue", emailValue)
  
  const forgetPasswordPath = `/reset-password?email=${user?.data?.email}`
 
  // console.log({forgetPasswordPath})

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    const toastId = toast.loading("Logging in...");

    try {
      const res = await login(formData).unwrap();
      if (res) {
        const { token } = res.data;
        const user: any = jwtDecode(token);
        dispatch(setUser({ user, token }));
        router.push("/");
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  const handleForgetPassword = async() => {
    const res = await forgetPassword({email:emailValue})
    const resetUILink = res?.data?.data
    console.log("{resetUILink}",res?.data?.data)
    console.log({res})
    if(user){
      router.push(forgetPasswordPath as string)
      // router.push(resetUILink)
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Login</h3>
      <div className="w-[35%]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-3">
              <CustomInput label="Email" name="email" size="sm" />
            </div>
            <div className="py-3">
              <CustomInput
                label="Password"
                name="password"
                size="sm"
                type="password"
              />
            </div>
            <div className="flex py-2 px-1 justify-between">
              {/* <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox> */}
              <div></div>
              <Link color="primary"
                onClick={handleForgetPassword}
                href={`${forgetPasswordPath}`}
               >
                Forgot password?
              </Link>
            </div>

            <Button
              className="my-3 w-full rounded-md bg-default-900 text-default"
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </form>
        </FormProvider>
        <div className="text-center">
          Not have an account ?{" "}
          <Link
            // onClick={() => handleForgetPassword()}
            href={"/register"}
            className="text-blue-500 hover:text-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
      <div>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default LoginPage;
