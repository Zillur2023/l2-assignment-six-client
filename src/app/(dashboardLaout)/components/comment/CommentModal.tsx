// CreatePostModal.tsx
"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { RootState } from "../../../redux/store";
import { useGetUserQuery } from "../../../redux/features/user/userApi";
import { useAppSelector } from "../../../redux/hooks";
import { useCreateCommentMutation } from "../../../redux/features/comment/commentApi";

interface CreatePostModalProps {
  postId:string
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CommentModal: React.FC<CreatePostModalProps> = ({
  postId,
  isOpen,
  onOpenChange,
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [createComment] = useCreateCommentMutation()
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const updatedData = {
      ...data, // Spread the existing data
      userId: userData?.data?._id,
    };
    console.log({ updatedData });
    const res = await createComment(updatedData).unwrap();
    console.log({ res });
    onOpenChange(false); // Close modal after submission
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {/* Create a Comment */}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              

                {/* Comment Input with Controller */}
                <div>
                  <label htmlFor="commentText">Comment</label>
                  <Controller
                    name="commentText"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Comment"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
