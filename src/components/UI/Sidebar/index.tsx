/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from "next/image";
import { SidebarOptions } from "./SidebarOptions";
import { adminLinks, userLinks } from "./constant";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  useGetUserQuery,
  useUpdateVerifiedMutation,
} from "@/redux/features/user/userApi";
import UpdateProfile from "@/components/profile/ProfileUpdate";
import { VerifiedIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useIsAvailableForVeriedQuery } from "@/redux/features/post/postApi";
import PostUpdate from "@/components/post/PostUpdate";
import { IUserData } from "@/type";

const Sidebar = () => {
  // const { user } = useUser();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery<IUserData>(user?.email, {
    skip: !user?.email,
  });
  const { data: IsAvailableForVerified } =
    useIsAvailableForVeriedQuery(userData?.data?._id, {
      skip: !userData?.data?._id,
    });

  const [updateVerified] = useUpdateVerifiedMutation();

  const handleUpdateVerified = async (id: string) => {
    const toastId = toast.loading("loading...");

    try {
      const res = await updateVerified(id).unwrap();

      if (res?.data?.paymentSession?.payment_url) {
        const paymentUrl = res.data.paymentSession.payment_url;
        window.location.href = paymentUrl; // Redirect to the payment URL
      }
      // toast.success(res?.message, {id: toastId})
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };


  return (
    <div>
      <div className="rounded-xl bg-default-100 p-2">
        {/* Profile Image */}
        <div className="h-[330px] w-full rounded-md">
          <Image
            alt="profile"
            className="w-full h-full object-cover rounded-md"
            height={330}
            src={userData?.data?.image as string}
            width={330}
          />
        </div>

        {/* User Info */}
        <div className="my-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold">{userData?.data?.name}</h1>
            {/* Verified Badge */}
            {userData?.data?.isVerified && (
              <VerifiedIcon className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="break-words text-sm">{userData?.data?.email}</p>
            {!userData?.data?.isVerified &&
              IsAvailableForVerified?.data?.length > 0 && (
                <Button
                  radius="full"
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                  onClick={() => handleUpdateVerified(userData?.data?._id)}
                >
                  Pay for verify
                </Button>
              )}
          </div>

          {/* <p className="break-words text-sm">{userData?.data?.bio}</p> */}
        </div>

        {/* Followers and Following Info */}
        <div className="my-2 flex justify-between">
          <div className="text-center">
            {userData?.data?.followers?.length > 0 ? (
              <span className="block font-semibold text-sm">
                Followers: {userData?.data?.followers.length}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="text-center">
            {userData?.data?.following?.length > 0 && (
              <span className="block font-semibold text-sm">
                Following: {userData?.data?.following.length}
              </span>
            )}
          </div>
        </div>

        {/* Create Post */}
        <div className="my-3">
          <PostUpdate />
        </div>

        {/* Update Profile */}
        <div className="my-3">
          {/* <UpdateProfile /> */}
          <UpdateProfile />
        </div>
      </div>

      <div className="mt-3 space-y-2 rounded-xl bg-default-100 p-2">
        <SidebarOptions
          links={user?.role === "user" ? userLinks : adminLinks}
        />
      </div>
    </div>
  );
};

export default Sidebar;
