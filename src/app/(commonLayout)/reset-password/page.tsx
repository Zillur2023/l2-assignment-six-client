/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, Suspense } from 'react';
import { Button } from '@nextui-org/react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomInput from '@/components/form/CustomInput';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { resetPasswordValidationSchema } from '@/schemas';

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get('email') || '';
  const tokenQuery = searchParams.get('token') || '';
  
  const [resetPassword] = useResetPasswordMutation();

  const methods = useForm({
    resolver: zodResolver(resetPasswordValidationSchema),
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (emailQuery) {
      setValue("email", emailQuery);
    }
  }, [emailQuery, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    const data = {
      email: emailQuery,
      newPassword: formData?.password,
      token: tokenQuery,
    };
    const toastId = toast.loading("loading...");

    try {
      const res = await resetPassword(data).unwrap();
      if (res) {
        router.push("/login");
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
              <CustomInput label="Password" name="password" size="sm" type="password" />
            </div>
            <Button
              className="my-3 w-full rounded-md bg-default-900 text-default"
              size="lg"
              type="submit"
            >
              Reset password
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
