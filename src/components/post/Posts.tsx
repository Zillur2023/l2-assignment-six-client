/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
// import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Tooltip,
} from "@nextui-org/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  VerifiedIcon,
  Trash2,
  Pencil,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  useGetUserQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import {
  useDeletePostMutation,
  useGetAllPostQuery,
  useUpdateDownvoteMutation,
  useUpdateUpvoteMutation,
} from "@/redux/features/post/postApi";
import CommentModal from "../comment/CommentModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { allCategoryName } from "./constant";
import Author from "../shared/Author";
import PostUpdate from "./PostUpdate";
import CustomModal from "../modal/CustomModal";
import CustomButton from "../shared/CustomButton";
import { IPost } from "@/type";

interface PostsProps {
  postId?: string;
  commentModal?: boolean;
}

const Posts: React.FC<PostsProps> = ({ postId, commentModal = true }) => {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "highestUpvotes" | "lowestUpvotes" | "highestDownvotes" | "lowestDownvotes"
  >("highestUpvotes");
  const queryPost = postId
    ? { postId }
    : {
        searchTerm,
        category: category || undefined,
        sortBy,
      };
  const { data: postsData } = useGetAllPostQuery(queryPost);
  console.log({ userData });
  console.log({ postsData });
  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();

  const handleUpvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateUpvote(postData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleDownvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateDownvote(postData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleUpdateFollowUnfollow = async (id: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    try {
      const res = await updateFollowUnfollow({
        targetId: id,
        loginUserId: userData?.data?._id,
      }).unwrap();
    } finally {
    }
  };

  const handleDeleteClick = async (postId: string) => {
    const toastId = toast.loading("loading...");
    try {
      const res = await deletePost(postId).unwrap();
      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="mt-6 space-y-6 max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
      {!postId && (
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mb-4"
          />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "highestUpvotes"
                  | "lowestUpvotes"
                  | "highestDownvotes"
                  | "lowestDownvotes"
              )
            }
            className="border rounded p-2 mb-4"
          >
            <option value="">Sort</option>
            <option value="highestUpvotes">Highest Upvotes</option>
            <option value="lowestUpvotes">Lowest Upvotes</option>
            <option value="highestDownvotes">Highest Downvotes</option>
            <option value="lowestDownvotes">Lowest Downvotes</option>
          </select>
          <select
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 mb-4"
          >
            <option value="">All Categories</option>
            {allCategoryName.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {postsData?.data?.map((post: IPost) => (
        <Card key={post._id} isFooterBlurred className=" w-full">
          {/* Author Info */}
          <CardHeader className=" justify-between ">
            <Author author={post?.author} nameClass="text-lg font-semibold" />
            <div className="flex items-center gap-3">
              {post?.author?._id !== userData?.data?._id && (
                <CustomButton
                  onClick={() => handleUpdateFollowUnfollow(post?.author?._id)}
                  buttonId="followOrUnfollow"
                  btnClass=" "
                >
                  {userData?.data?.following?.includes(post?.author?._id)
                    ? "Unfollow"
                    : "Follow"}
                </CustomButton>
              )}
              {post?.author?._id === userData?.data?._id && (
                <PostUpdate updatePostData={post} btn={<Pencil  />} />
              )}
              {post?.author?._id === userData?.data?._id && (
                <CustomModal
                  title=""
                  openButton={
                    <Trash2 className="text-red-500 cursor-pointer" />
                  }
                  actionButtonText="Delete"
                  onUpdate={() => handleDeleteClick(post?._id)}
                >
                  <Author
                    author={post?.author}
                    nameClass="text-lg font-semibold"
                  />
                  <p className=" text-center ">
                    <strong>Category:</strong> {post?.category}
                  </p>
                  <p className=" text-center ">
                    <strong>Title:</strong> {post?.title} .
                  </p>
                </CustomModal>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <p className=" py-2">#{post?.category} </p>
            {/* Post Title */}
            <p className=" mb-2">{post?.title}</p>

            {/* Post Image */}
            {post.image && (
              <div className=" w-full h-[250px] flex justify-center items-center ">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  height={250}
                  alt={post?.category}
                  // className=" object-cover "
                  src={post?.image}
                />
              </div>
            )}

            {/* Post Content */}
            <p className="mb-6 text-gray-700">{post.content}</p>
          </CardBody>

          <CardFooter className="justify-between ">
            {/* Post Interactions */}
            <div className="">
              {/* <Tooltip content={post?.upvotes?.[index+1]?.name}> */}
            
                <CustomButton
                  onClick={() => handleUpvote(post._id)}
                  buttonId="upvote"
                  data={post?.upvotes}
                >
                  <ThumbsUp
                    size={18}
                    className={`${
                      post?.upvotes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />

                  <span>{post.upvotes.length}</span>
                </CustomButton>
            </div>
            <div>
            
                <CustomButton
                  onClick={() => handleDownvote(post._id)}
                  buttonId="downvote"
                  data={post?.downvotes}
                >
                  <ThumbsDown
                    size={18}
                    className={`${
                      post?.downvotes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                  <span>{post.downvotes.length}</span>
                </CustomButton>
            </div>

            <div className="">
              {commentModal ? (
                <CommentModal
                  postId={post?._id}
                  openButton={
                    <button className="flex items-center space-x-2 hover:bg-gray-300 py-1 px-2 rounded-md">
                      <MessageCircle size={18} />
                      <span>{post.comments?.length}</span>
                    </button>
                  }
                />
              ) : (
                <button className="flex items-center space-x-2 hover:bg-gray-300 py-1 px-2 rounded-md">
                  <MessageCircle size={18} />
                  <span>{post.comments?.length}</span>
                </button>
              )}
            </div>
            <div>
              <Button
                size="sm"
                className="flex items-center space-x-2 bg-transparent hover:bg-gray-300 "
              >
                <Share2 size={18} />
                {/* <span>{post.shares}</span> */}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Posts;
