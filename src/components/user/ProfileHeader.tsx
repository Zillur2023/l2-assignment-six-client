import { IUser } from "@/type";
import {
  Avatar,
  Button,
  Card,
  AvatarGroup,
  Tabs,
  Tab,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { Camera } from "lucide-react";
import LinkUpInputFile from "../form/CustomInputFile";

import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import EditProfile from "./EditProfile";
import { usePathname } from "next/navigation";
import { friends } from "./Friends";
import Link from "next/link";
import CustomModal from "../modal/CustomModal";
import CustomForm from "../form/CustomForm";

interface ProfileHeaderProps {
  user: IUser;
  profileRoute: { href: string; label: string }[];
}

export const ProfileHeader = ({ user, profileRoute }: ProfileHeaderProps) => {
  console.log({ profileRoute });
  // export const ProfileHeader = (user: IUser) => {
  const pathname = usePathname();
  const [updateUser] = useUpdateUserMutation();

  const handleEditImage = async (data: any) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ _id: user?._id }));
    if (data?.coverImage) {
      formData.append("coverImage", data?.coverImage);
    } else if (data?.profileImage) {
      formData.append("profileImage", data?.profileImage);
    }

    const toastId = toast.loading("loading..");

    try {
      const res = await updateUser(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <Card className="" radius="none">
      <div className="w-full md:w-[70%] mx-auto  ">
        <div className="relative">
          {user && (
            <Avatar
              src={user?.coverImage}
              alt="Cover"
              className=" w-full h-72"
              radius="none"
            />
          )}

          <div className="absolute bottom-2 right-2 ">
            <CustomModal
              // buttonSize="md"
              // openButtonText={
              //   <span className="hidden lg:block">
              //     {user?.coverImage ? "Update cover image" : "Add cover image"}
              //   </span>
              // }
              // startContent={<Camera />}
              title={`${
                user?.coverImage ? "Update cover image" : "Add cover image"
              }`}
              // variant="solid"
              // className="bg-gray-800 dark:bg-none text-white"
            >
              <CustomForm
                // resolver={zodResolver(postEditorValidationSchema)}
                onSubmit={handleEditImage}
              >
                <div className="py-3">
                  <LinkUpInputFile name="coverImage" label="Add cover image" />
                </div>
              </CustomForm>
            </CustomModal>
          </div>
        </div>

        <div className=" px-5">
          <div className=" -mt-5 flex flex-col lg:flex-row mx-auto   ">
            <div className="relative mx-auto  ">
              {user && (
                <Avatar
                  src={user?.profileImage}
                  className=" relative  w-28 h-28 "
                  radius="full"
                />
              )}

              <div className="absolute bottom-5 right-0 ">
                <CustomModal
                  // radius="full"
                  // openButtonIcon={<Camera />}
                  title={`${
                    user?.profileImage
                      ? "Update profile image"
                      : "Add profile image"
                  }`}
                  // variant="solid"
                  // className="bg-gray-800 dark:bg-none text-white"
                >
                  <CustomForm
                    // resolver={zodResolver(postEditorValidationSchema)}
                    onSubmit={handleEditImage}
                  >
                    <div className="py-3">
                      <LinkUpInputFile
                        name="profileImage"
                        label={`${
                          user?.profileImage
                            ? "Update profile image"
                            : "Add profile image"
                        }`}
                      />
                    </div>
                  </CustomForm>
                </CustomModal>
              </div>
            </div>
            <div className=" mt-5  w-full px-2 pb-3 ">
              <p className=" text-center lg:text-start text-xl font-semibold ">
                {user?.name}
              </p>
              <p className=" text-center lg:text-start">
                {friends?.length} friends
              </p>
              <div className=" flex flex-col lg:flex-row items-center justify-between ">
                <Link href={`/${user.name}/friends`}>
                  <AvatarGroup
                    max={8}
                    className=" hover:cursor-pointer"
                    total={friends?.length}
                    renderCount={(count) => (
                      <p className="text-small text-foreground font-medium ms-2 hover:underline hover:cursor-pointer">
                        +{count} others
                      </p>
                    )}
                  >
                    {friends?.map((friend, i) => (
                      <Avatar
                        key={i}
                        src={friend?.image}
                        onClick={() => console.log({ i })}
                      />
                    ))}
                  </AvatarGroup>
                </Link>
                {/* <Button className="" startContent={<Edit />}>
                Edit Profile
              </Button> */}
                <div className=" my-2">
                  <EditProfile {...user} />
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <Tabs
            aria-label="Tabs"
            selectedKey={pathname}
            // fullWidth

            color="primary"
            variant="underlined"
          >
            {profileRoute.map((item) => (
              <Tab
                key={item.href}
                className=" max-w-fit h-full"
                title={
                  <Button
                    className={`${
                      pathname === item.href ? "text-blue-500" : ""
                    }  `}
                    href={item.href}
                    as={Link}
                    variant="light"
                  >
                    {item.label}
                  </Button>
                }
              />
            ))}
          </Tabs>
        </div>
      </div>
    </Card>
  );
};
