"use client";
import React, { useEffect } from 'react';
import CustomForm from '../form/CustomForm';
import CustomInput from '../form/CustomInput';
import { Button } from '@nextui-org/react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordValidationSchema } from '@/schemas';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get('email') || ''; // Get the 'email' query param or set it to an empty string
  const tokenQuery = searchParams.get('token') || ''; // Get the 'email' query param or set it to an empty string
  console.log({emailQuery})
  const [resetPassword] = useResetPasswordMutation();


  

  const methods = useForm({
    resolver: zodResolver(resetPasswordValidationSchema),
    // defaultValues: {
    //   email: emailQuery, // Set email as default value
    // },
  });

  const { handleSubmit, setValue  } = methods;

  useEffect(() => {
    if (emailQuery) {
      setValue("email", emailQuery);
    }
  }, [emailQuery,setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    const data = {
      email: emailQuery,
      newPassword: formData?.password,
      token: tokenQuery,
    };
    console.log('requestPassworddata', data)

    const toastId = toast.loading("Logging in...");

    try {
      const res = await resetPassword(data).unwrap();
      if (res) {
        router.push("/login")
        toast.success(res?.message, { id: toastId });
          
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Reset Password</h3>
      <div className="w-[35%]">
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3">
            <CustomInput label="Email" name="email" size="sm" isReadOnly={true} />
          </div>
          <div className="py-3">
            <CustomInput
              label="Password"
              name="password"
              size="sm"
              type="password"
            />
          </div>
          <Button
            className="my-3 w-full rounded-md bg-default-900 text-default"
            size="lg"
            type="submit"
          >
            Send Email
          </Button>
          </form>
                </FormProvider>
      </div>
    </div>
  );
};

export default ResetPassword;
