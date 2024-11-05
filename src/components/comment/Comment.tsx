/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ReactNode, useState } from "react";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Avatar } from "@nextui-org/react";
import { Trash2 } from "lucide-react"; // Import the X icon for the close button
// import { useAppSelector } from "@/redux/hooks";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetAllCommentQuery,
} from "@/redux/features/comment/commentApi";
// import { RootState } from "@/redux/store";
import { toast } from "sonner";
import CustomInput from "../form/CustomInput";
import { useUser } from "@/context/user.provider";
// import LoadingButton from '../shared/LoadingButton';



const Comment = ({postId}: {postId: string}) => {
  // const { user } = useAppSelector((state: RootState) => state.auth);
  const { user } = useUser();
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [deleteComment] = useDeleteCommentMutation();
  const [createComment] = useCreateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);
  const [commentLoading, setCommentLoading] = useState(false);

  const methods = useForm();

  const { handleSubmit, reset, watch } = methods;

  const commentText = watch("commentText"); // Watch the comment input field

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const updatedData = {
      ...data,
      userId: userData?.data?._id,
      postId,
    };
    try {
      setCommentLoading(true);
      await createComment(updatedData).unwrap();
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const toastId = toast.loading("loading...");
    try {
      const res = await deleteComment(commentId).unwrap();

      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (

      <div className="flex-1 overflow-y-auto px-4">
        <p className=" font-semibold my-3">See all comments</p>
       
        <div className="space-y-4">
          {allCommentData?.data?.map((comment: any) => (
            <div key={comment?._id} className="flex items-start space-x-2">
              <Tooltip content={comment?.userId?.email}>
                <Avatar src={comment?.userId?.image} alt="Commenter" />
              </Tooltip>
              <div className=" bg-transparent text-gray-500 p-2 rounded-lg">
                <div className="flex gap-3 ">
                  <p>
                    <strong>{comment?.userId?.name}</strong>
                  </p>
                  <Trash2
                    onClick={() => handleDeleteComment(comment?._id)}
                    className="text-red-500 cursor-pointer size-4"
                  />
                </div>
                {/* {comment?.author?._id == userData?.data?._id &&  <Trash2 onClick={() => handleDeleteComment(comment?._id)} className="text-red-500 cursor-pointer" />} */}

                <p>{comment?.commentText}</p>
              </div>
            </div>
          ))}
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center gap-2 my-3"
          >
            <div className=" w-full">
              <CustomInput label="Comment" name="commentText" size="sm" />
            </div>
            <Button
              type="submit"
              color={commentText ? "secondary" : "default"}
              className={!commentText ? "bg-gray-300" : ""}
              disabled={!commentText}
            >
              {commentLoading ? (
                <Spinner /> // Show spinner when loading
              ) : (
                "Comment"
              )}
            </Button>
            {/* <LoadingButton
                  type='submit'
                  buttonId="commentModal"
                  // loading={isSubmitting}
                >
                  Comment
                </LoadingButton> */}
          </form>
        </FormProvider>
      </div>
  );
};

export default Comment;