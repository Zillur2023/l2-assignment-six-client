/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '@/components/form/CustomInput';
import { changePasswordValidationSchema } from '@/schemas';
// import { useUser } from '@/context/user.provider';
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { useUser } from '@/context/user.provider';


const ChangePassword: React.FC = () => {
  // const { user } = useAppSelector((state: RootState) => state.auth);
  const { user } = useUser()
  const [changePassword] = useChangePasswordMutation();
  // const [email, setEmail] = useState(user?.email, {skip: !user?.email,
  // })


  

  const methods = useForm({
    resolver: zodResolver(changePasswordValidationSchema),
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

    const toastId = toast.loading("loading...");

    try {
      const res = await changePassword(data).unwrap();
      if (res.success) {
        // router.push("/login")
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
            <CustomInput label="Email" name="email" size="sm" value={user?.email || ''}  isReadOnly={true} />
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
