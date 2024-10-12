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

const Posts = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  // const {data:posts} = useGetAllPostQuery(userData?.data?._id, { skip: !userData?.data?._id })
  const {data:posts} = useGetAllPostQuery('')
  // console.log({user})
  // console.log({userData})
  // console.log({posts})
  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Using useDisclosure
  const [postIdForComment, setPostIdForComment] = useState<string | null>(null);

  const handleUpvote = async (postId:string) => {
  
      const postData = {
        userId: userData?.data?._id,
        postId
      }
        // If the post is not upvoted, perform the upvote
        const upvote = await updateUpvote(postData).unwrap(); // Use unwrap to handle errors
        console.log({upvote})
  };
  const handleDownvote = async (postId:string) => {
  
      const postData = {
        userId: userData?.data?._id,
        postId
      }
        // If the post is not upvoted, perform the upvote
        const downvote = await updateDownvote(postData).unwrap(); // Use unwrap to handle errors
        console.log({downvote})
  };

  const handleCommentClick = (postId: string) => {
    setPostIdForComment(postId); // Set the postId for which the comment is being created
    onOpen(); // Open the modal using the disclosure hook
  };

  return (
    <div className="mt-6">
      {posts?.data?.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          {/* Post content */}
          <p className="mb-4">{post.content}</p>

          {/* Post image using Next.js Image component for optimization */}
          {post.image && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={post.image}
                alt="Post"
                layout="fill" // Ensures the image scales to fit the parent div
                objectFit="cover" // Ensures the image is cropped if necessary to fit the box
                className="rounded-lg"
              />
            </div>
          )}

          {/* Post interaction buttons (like, comment, share) */}
          <div className="flex justify-between text-gray-500">
            <Button auto light size="sm" onClick={() => handleUpvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsUp size={18} />
              <span>{(post.upvotes.length) ?+1:""}</span>
            </Button>
            <Button auto light size="sm" onClick={() => handleDownvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsDown  size={18} />
              <span>{(post.downvotes.length) ?+1:""}</span>
            </Button>

            <Button auto light size="sm"  onClick={() => handleCommentClick(post?._id)} className="flex items-center space-x-2">
              <MessageCircle size={18} />
              <span>{(post.comments.length) ?+1:""}</span>
            </Button>

            <Button auto light size="sm" className="flex items-center space-x-2">
              <Share2 size={18} />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>
      ))}
        {/* Comment Modal */}
        {postIdForComment && (
        <CommentModal
          postId={postIdForComment}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  );
};

export default Posts;

