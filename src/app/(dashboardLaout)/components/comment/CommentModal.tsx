import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button
} from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { Avatar } from '@nextui-org/react';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useGetUserQuery } from '../../../redux/features/user/userApi';
import { useCreateCommentMutation, useGetAllCommentQuery } from '../../../redux/features/comment/commentApi';
import Posts from '../post/Posts';

interface CommentModalProps {
  postId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPostComment: () => void; // New prop to trigger post data refetch
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  isOpen,
  onOpenChange,
  onPostComment, // Accept the new prop
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const { control, handleSubmit, reset, watch } = useForm();
  const [createComment] = useCreateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);

  const commentText = watch('commentText'); // Watch the comment input field

  const onSubmit = async (data: any) => {
    const updatedData = {
      ...data,
      userId: userData?.data?._id,
      postId,
    };
    await createComment(updatedData).unwrap();
    reset();
    onOpenChange(false); // Close the modal
    onPostComment(); // Refetch the posts
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="flex flex-col justify-between h-full"
    >
      <ModalContent>
        <ModalHeader className="sticky top-0 bg-white z-10 p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <Avatar src={userData?.data?.avatar} alt="User Avatar" />
            <p>{userData?.data?.name}</p>
          </div>
        </ModalHeader>

        {/* Modal body for showing post and comments */}
        <ModalBody className="flex-1 overflow-y-auto px-4">
          {/* Post content */}
          <div className="mb-4">
            <Posts postId={postId} />
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            {allCommentData?.data?.map((item) => (
              <div key={item?._id} className="flex items-start space-x-2">
                <Avatar src="/path/to/commenter-avatar.jpg" alt="Commenter" />
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p><strong>{item?.userId?.name}</strong></p>
                  <p>{item?.commentText}</p>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>

        {/* Sticky Footer with input to add comment */}
        <ModalFooter className="sticky bottom-0 bg-white z-10 p-4 shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center w-full space-x-2"
          >
            <Controller
              name="commentText"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  fullWidth
                  placeholder="Write a comment..."
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
               <Button
              auto
              type="submit"
              color={commentText ? 'primary' : 'default'} // Use default color when disabled
              className={!commentText ? 'bg-gray-300' : ''} // Apply custom styling when disabled
              disabled={!commentText} // Disable if no comment text
            >
              Comment
            </Button>
          </form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
