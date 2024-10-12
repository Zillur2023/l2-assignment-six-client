'use client'

import Image from 'next/image'; // Import Next.js image component for optimization
import { Button, useDisclosure } from '@nextui-org/react'; // Import only NextUI Button
import { ThumbsUp, ThumbsDown , MessageCircle, Share2 } from 'lucide-react'; // Import Lucide-react icons
import { RootState } from '../../../redux/store';
import { useGetUserQuery } from '../../../redux/features/user/userApi';
import { useAppSelector } from "../../../redux/hooks";
// import { useGetAllPostQuery } from '@/app/redux/features/post/postApi';
import { useGetAllPostQuery, useUpdateDownvoteMutation, useUpdateUpvoteMutation } from '../../../redux/features/post/postApi';
import { useState } from 'react';
import CommentModal from '../comment/CommentModal';

interface PostsProps {
  postId?: string; // Accept postId as an optional prop
}

const Posts = ({ postId }: PostsProps) => {
  console.log({postId})
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const { data: postsData, refetch } = useGetAllPostQuery(postId || '');
  console.log({postsData})
  // const { data: postsData, refetch } = useGetAllPostQuery('');

  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [postIdForComment, setPostIdForComment] = useState<string | null>(null);

  const handleUpvote = async (postId: string) => {
    const postData = { userId: userData?.data?._id, postId };
    const upvote = await updateUpvote(postData).unwrap();
    console.log({ upvote });
  };

  const handleDownvote = async (postId: string) => {
    const postData = { userId: userData?.data?._id, postId };
    const downvote = await updateDownvote(postData).unwrap();
    console.log({ downvote });
  };

  const handleCommentClick = (postId: string) => {
    setPostIdForComment(postId);
    onOpen();
  };

  const handlePostComment = () => {
    refetch(); // Refetch posts after a comment is added
  };

  return (
    <div className="mt-6">
      {postsData?.data?.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="mb-4">{post.content}</p>

          {post.image && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={post.image}
                alt="Post"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-between text-gray-500">
            <Button auto light size="sm" onClick={() => handleUpvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsUp size={18} />
              <span>{post.upvotes.length}</span>
            </Button>
            <Button auto light size="sm" onClick={() => handleDownvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsDown size={18} />
              <span>{post.downvotes.length}</span>
            </Button>
            <Button auto light size="sm" onClick={() => handleCommentClick(post?._id)} className="flex items-center space-x-2">
              <MessageCircle size={18} />
              <span>{post?.comments?.length}</span>
            </Button>
            <Button auto light size="sm" className="flex items-center space-x-2">
              <Share2 size={18} />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>
      ))}

      {postIdForComment && (
        <CommentModal
          postId={postIdForComment}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onPostComment={handlePostComment} // Pass the refetch handler to CommentModal
        />
      )}
    </div>
  );
};

export default Posts


