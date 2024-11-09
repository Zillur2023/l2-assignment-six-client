/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useState } from "react";
// import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image
} from "@nextui-org/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Trash2,
  Pencil,
  Download,
} from "lucide-react";
// import { useAppSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {  categoryOptions, sortOptions } from "./constant";
import Author from "../shared/Author";
import PostUpdate from "./PostUpdate";
import CustomModal from "../modal/CustomModal";
import CustomButton from "../shared/CustomButton";
import { IPost, IPostData, IUserData } from "@/type";
import NoDataFound from "../shared/NoDataFound";
// import { useUser } from "@/context/user.provider";
import Comment from "../comment/Comment";
// import ActionButton from "../shared/ActionButton";
import { generatePDF } from "@/utils/generatePDF";
import useDebounce from "@/hooks/debounce.hooks";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Loading from "../UI/Loading";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PostsProps {
  postId?: string;
  comment?: boolean;
}

const Posts: React.FC<PostsProps> = ({ postId , comment = true }) => {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  // const { user } = useUser();
  const { data: userData } = useGetUserQuery<IUserData>(user?.email, {
    skip: !user?.email,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  console.log('category and ', category)
  console.log(' and sortBy', sortBy,)




  
  const debounceSearch = useDebounce(searchTerm)
  
  

  const queryPost = postId
    ? { postId }
    : {
        // searchTerm,
        searchTerm : debounceSearch,
        category,
        sortBy,
        isPremium: userData?.data?.isVerified ? true : undefined,
      };
  const { data: postData } = useGetAllPostQuery<IPostData>(queryPost);


  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const postRef = useRef<HTMLDivElement>(null); // Ref for the div to be converted to PDF


  const handleCommentClick = (postId: string) => {
    inputRefs?.current[postId]?.focus();
  };

  const handleUpvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const upvotePostData = { userId: userData?.data?._id, postId };
    try {
      await updateUpvote(upvotePostData).unwrap();
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
    const downvotePostData = { userId: userData?.data?._id, postId };
    try {
      await updateDownvote(downvotePostData).unwrap();
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
    <>
      { !postData ? <Loading /> : (postData?.data?.length === 0 && <NoDataFound />) }
        <div className="mt-6 space-y-6 max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
       
          { !postId && postData?.data?.length > 0  &&  (
           <div className="flex flex-col sm:flex-row  items-center justify-between ">
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
                  setSortBy(e.target.value) 
                }
                className=" border-medium rounded p-2 mb-4"
              >
                <option value="">Sort</option>
                {sortOptions.map((sort) => (
                  <option key={sort} value={sort}>
                    {sort}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-medium rounded p-2 mb-4"
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>)  }
        

          {postData?.data?.map((post) => (
            <Card
              ref={postRef}
              key={post._id}
              isFooterBlurred
              className=" w-full p-0 md:p-5 "
            >
              {/* Author Info */}
              <CardHeader className=" justify-between ">
                <Author
                  author={post?.author}
                  nameClass="text-lg font-semibold"
                />
                <div className="flex items-center gap-3">
                  {post?.author?._id !== userData?.data?._id && (
                    <CustomButton
                      onClick={() =>
                        handleUpdateFollowUnfollow(post?.author?._id)
                      }
                      buttonId="followOrUnfollow"
                      btnClass=" "
                    >
                      {userData?.data?.following?.includes(post?.author?._id)
                        ? "Unfollow"
                        : "Follow"}
                    </CustomButton>
                  )}
                  {post?.author?._id === userData?.data?._id && (
                    <PostUpdate
                      updatePostData={post}
                      btn={
                        <Pencil className="bg-gray-300 p-1 rounded-md w-full h-full" />
                      }
                    />
                  )}
                
                  {post?.author?._id === userData?.data?._id && (
                    <CustomModal
                      title=""
                      openButton={
                        <Trash2 className="text-red-500 cursor-pointer bg-gray-300 p-1 rounded-md w-full h-full" />
                      }
                      actionButtonText="Delete"
                      onUpdate={() => handleDeleteClick(post?._id)}
                    >
                      <p className=" text-red-500 font-semibold text-medium">
                        {" "}
                        Are your sure to delete{" "}
                      </p>
                    </CustomModal>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {post?.isPremium && (
                  <div className=" flex justify-end  ">
                    {" "}
                    <span className=" border-1  font-normal text-green-500 py-0 px-2 rounded-md">
                      Premium
                    </span>{" "}
                  </div>
                )}
                <p className=" py-2 text-lg font-medium">#{post?.category} </p>
                {/* Post Title */}
                <p className=" mb-3 text-xl font-medium">{post?.title}</p>

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
                <p className="my-5">{post.content}</p>
              </CardBody>

              <CardFooter className="justify-between ">
                {/* Post Interactions */}
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

                <div className="">
                 
                
                  <Button
                    size="sm"
                    className="flex items-center  bg-transparent hover:bg-gray-300 "
                    onClick={() => handleCommentClick(post._id)}
                  >
                    <MessageCircle size={18} />
                    <span>{post?.comments?.length}</span>
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                >
                  <Share2 size={18} />
                  {/* <span>{post.comments?.length}</span> */}
                </Button>
                {/* <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                >
                   <Download size={18} onClick={() => generatePDF(post)} className="bg-gray-300 p-1 rounded-md w-full h-full" />
                </Button> */}
                 <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                  onClick={() => generatePDF(postRef)}
                > <Download size={18}/> </Button>
              </CardFooter>
              <Comment
                postId={post?._id}
                openButton={
                  <p className=" font-semibold my-3 cursor-pointer hover:underline">
                    {/* See all comments */}
                    {/* {comment ? "See all comment" : " "} */}
                    {post?.comments?.length > 2 && comment ? "See all comment" : " "}
                  </p>
                }
                comment={comment ? true : false}
                focusRef={(el) => (inputRefs.current[post._id] = el)} 
              />
            </Card>
          ))}
        </div>
    
    </>
  );
};

export default Posts;
