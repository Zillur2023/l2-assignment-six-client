/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  // FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
// import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { useAppDispatch } from "@/redux/hooks";
import { useForgetPasswordMutation, useLoginMutation } from "@/redux/features/auth/authApi";
// import { setUser } from "@/redux/features/auth/authSlice";
import CustomInput from "@/components/form/CustomInput";
import { Button, Link } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "@/schemas";
// import GoogleLogin from "@/components/shared/GoogleLogin";
// import { useGetUserQuery } from "@/redux/features/user/userApi";

export type ILoginUser = {
  email: string;
  password: string
}

// import { useUser } from "@/context/user.provider";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [forgetPassword] = useForgetPasswordMutation()
  // const { setIsLoading: userLoading } = useUser();
  // const { user } = useAppSelector((state: RootState) => state.auth);

 

  const methods = useForm<ILoginUser>({
    resolver: zodResolver(loginValidationSchema), // Pass the Zod resolver here
  });

  const { handleSubmit, watch } = methods;

  const emailValue = watch("email");

  // Run the query only if emailValue is not null or empty
  // const { data: userData } = useGetUserQuery(emailValue, {
  //   skip: !emailValue,
  // });
  
  // const forgetPasswordPath = `/reset-password?email=${userData?.data?.email}`
 


  const onSubmit: SubmitHandler<ILoginUser> = async (formData) => {
  
    const toastId = toast.loading("Logging in...");

    try {
      const res = await login(formData).unwrap();

      if (res?.success) {
        // userLoading(true);
        // userLoading(false); 
        const { token } = res.data;
        const user: any = jwtDecode(token);
        dispatch(setUser({ user, token }));
        router.push("/");
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
    //  finally {
    //   // userLoading(false); 
    // }
  };

  const handleForgetPassword = async() => {
   try {
    const res = await forgetPassword({email:emailValue})

    if(res.data?.success){
      // router.push(forgetPasswordPath as string)
      toast.success(res?.data?.message)
    } else {
     toast.error("This user not found")
    }
   } catch (error:any) {
    
    toast.error(error?.data?.message)
   }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Login</h3>
      <div className="w-[35%]">
        <FormProvider {...methods} >
          <form onSubmit={handleSubmit(onSubmit)} >
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
              <Link color="primary"
                onClick={handleForgetPassword}
                // href={`${forgetPasswordPath}`}
                isDisabled={!emailValue}
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
      {/* <div>
        <GoogleLogin />
      </div> */}
    </div>
  );
};

export default LoginPage;
