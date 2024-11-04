/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, ChangeEvent, ReactNode } from "react";
import {
  // Controller,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { useAppSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { toast } from "sonner";
import CustomModal from "../modal/CustomModal";
import CustomInput from "../form/CustomInput";
import CustomSelect from "../form/CustomSelect";
import { categoryOptions } from "./constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { postUpdateValidationSchema } from "@/schemas";
import { Checkbox } from "@nextui-org/react";
import { IPost, IUserData } from "@/type";
import { useUser } from "@/context/user.provider";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import dynamic from "next/dynamic";
import useDebounce from "@/hooks/debounce.hooks";

interface UpdatePostProps {
  updatePostData?: IPost; // Add initialPostData to hold post info for editing
  btn?: ReactNode;
}

// type FormValues = {
//   title: string;
//   content: string;
//   category: string;
//   image?: UploadFile[];
// };

const PostUpdate: React.FC<UpdatePostProps> = ({ updatePostData, btn }) => {
  // const { user } = useAppSelector((state: RootState) => state.auth);
  const { user } = useUser();
  const { data: userData } = useGetUserQuery<IUserData>(user?.email, {
    skip: !user?.email,
  });
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  // const [contentValue, setContentValue] = useState("")
  // console.log({ contentValue });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const methods = useForm({
    resolver: zodResolver(postUpdateValidationSchema),
  });

  const { handleSubmit, setValue, register, reset, watch } = methods;

  // const contentValue = useDebounce(watch("content"));
  const contentValue = watch("content");

  // const contentValue = useDebounce(content);

  // Populate form when updating
  // useEffect(() => {
  //   if (updatePostData) {
  //     setValue("title", updatePostData?.title);
  //     setValue("category", updatePostData?.category);
  //     setValue("content", updatePostData?.content);
  //     // setValue("content", contentValue);
  //   }
  // }, [updatePostData, setValue, contentValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("PostUpdateformData", data);
    // const tempElement = document.createElement("div");
    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.content;
    const plainText = tempElement.textContent || tempElement.innerText || "";
    console.log({plainText})
    const formData = new FormData();

    const updatedData: any = {
      ...data,
      _id: updatePostData?._id,
      author: userData?.data?._id,
      content: plainText,
    };
    console.log({ updatedData });

    formData.append("image", imageFiles?.[0]);

    formData.append("data", JSON.stringify(updatedData));

    const toastId = toast.loading("loading...");
    try {
      const res = updatePostData
        ? await updatePost(formData).unwrap()
        : await createPost(formData).unwrap();

      if (res.success) {
        toast.success(res.message, { id: toastId });
        reset();
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    setImageFiles((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <CustomModal
      // buttonText="Edit Profile"
      openButtonText={`${updatePostData ? "Update Post" : "Create a new post"}`}
      actionButtonText={`${updatePostData ? "Update" : "Create"}`}
      title={`${updatePostData ? "Update Post" : "Create a new post"}`}
      buttonVariant="bordered"
      buttonClassName="rounded-md border hover:border-blue-500 py-0 w-full"
      onUpdate={handleSubmit(onSubmit)}
      openButton={btn}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {userData?.data?.isVerified && (
            <Checkbox
              {...register("isPremium")}
              classNames={{
                label: "text-small",
              }}
            >
              Premium Post
            </Checkbox>
          )}
          <div className="py-3">
            <CustomInput label="Title" name="title" size="sm" />
          </div>
          <div className="py-3">
            <CustomSelect
              label="Category"
              name="category"
              options={categoryOptions}
            />
          </div>
          {/* <div className=" py-3">
            {/* <Controller
              name="content"
              control={methods.control}
              render={({ field }) => (
                <ReactQuill {...field} placeholder="Write your post here..." />
              )}
            /> */}
            {/* <ReactQuill  placeholder="Write your post here..." /> */}
          {/* </div>  */}
          <div className="py-3">
            <ReactQuill
              value={contentValue}
              onChange={(value) => setValue("content", value)}
              // value={contentValue}
              // onChange={useDebounce((value) => setContentValue(value))}
              placeholder="Write your post here..."
            />
          </div>

          <div className="py-3">
            <label
              className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
              htmlFor="image"
            >
              Upload image
            </label>
            <input
              multiple
              className="hidden"
              id="image"
              type="file"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
          {imagePreviews.length > 0 && (
            <div className="flex gap-5 my-5 flex-wrap">
              <div className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2">
                <img
                  alt="item"
                  className="h-full w-full object-cover object-center rounded-md"
                  src={imagePreviews?.[0]}
                />
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </CustomModal>
  );
};

export default PostUpdate;
