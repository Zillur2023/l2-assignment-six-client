"use client";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
// import { useCreateUserMutation } from "@/app/redux/features/user/userApi";
import {useCreateUserMutation} from "../../redux/features/user/userApi"
import { toast } from "sonner";
// import { useCreateUserMutation } from '../../redux/user/userApi';
// import { toast } from 'sonner';

type FormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

const RegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    console.log({ formData });
    const result = await createUser(formData).unwrap();
    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.warning(result?.message);
      router.push("/login");
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center m-10 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  placeholder="Enter your name"
                  status={errors.name ? "error" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  id="email"
                  {...field}
                  placeholder="Enter your email"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password
                  id="password"
                  {...field}
                  placeholder="Enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  status={errors.password ? "error" : ""}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
          >
            Register
          </Button>
        </form>

        {/* Redirect to Login */}
        <Button
          type="link"
          onClick={goToLogin}
          className="w-full text-center mt-4"
        >
          If you have an account? Login
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
