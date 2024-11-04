"use client";
import React, { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/form/CustomInput';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { resetPasswordValidationSchema } from '@/schemas';
import { useUser } from '@/context/user.provider';


const ChangePassword: React.FC = () => {
  const {user} = useUser()
  const router = useRouter()
  const [resetPassword] = useResetPasswordMutation();


  

  const methods = useForm({
    // resolver: zodResolver(resetPasswordValidationSchema),
    // defaultValues: {
    //   email: emailQuery, // Set email as default value
    // },
  });

  const { handleSubmit, setValue  } = methods;

  useEffect(() => {
    if (user) {
      setValue("email", user?.email);
    }
  }, [user,setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    const data = {
      email: user?.email,
      oldPassword: formData?.oldPassword,
      newPassword: formData?.newPassword,
    };
    console.log('requestPassworddata', data)

    const toastId = toast.loading("loading...");

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
      <h3 className="my-2 text-xl font-bold">Change password</h3>
      <div className="w-[35%]">
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3">
            <CustomInput label="Email" name="email" size="sm" isReadOnly={true} />
          </div>
          <div className="py-3">
            <CustomInput
              label="Old password"
              name="oldPassword"
              size="sm"
              type="password"
            />
          </div>
          <div className="py-3">
            <CustomInput
              label="New password"
              name="newPassword"
              size="sm"
              type="password"
            />
          </div>
          <Button
            className="my-3 w-full rounded-md bg-default-900 text-default"
            size="lg"
            type="submit"
          >
            Change password
          </Button>
          </form>
                </FormProvider>
      </div>
    </div>
  );
};

export default ChangePassword;
