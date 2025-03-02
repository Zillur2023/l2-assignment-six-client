import { IUser } from "@/type";
import React from "react";

import { toast } from "sonner";
import CustomModal from "../modal/CustomModal";
import CustomForm from "../form/CustomForm";
import CustomTextarea from "../form/CustomTextarea";
import CustomInputFile from "../form/CustomInputFile";

const EditProfile = (user: IUser) => {
  const [updateUser] = useUpdateUserMutation();
  const onSubmit = async (data: any, reset?: () => void) => {
    console.log("post data", data);
    const formData = new FormData();

    formData.append("coverImage", data?.coverImage);
    formData.append("profileImage", data?.profileImage);

    formData.append(
      "data",
      JSON.stringify({
        ...data,
        _id: user?._id,
      })
    );

    const toastId = toast.loading("loading...");
    try {
      const res = await updateUser(formData).unwrap();
      // const res =  await createPost(formData).unwrap()
      if (res.success) {
        toast.success(res.message, { id: toastId });
        reset?.();
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <CustomModal
      // startContent={<Edit />}
      openButtonText={"Edit Profile"}
      title={` Edit Profile`}
      // variant="solid"
    >
      <CustomForm
        //   resolver={zodResolver(postEditorValidationSchema)}
        onSubmit={onSubmit}
      >
        <div className="py-3">
          <CustomTextarea
            name="bio"
            label={`${user?.bio ? "Update bio" : "Add bio"}`}
          />
        </div>

        <div className="py-3">
          <CustomInputFile
            name="coverImage"
            label={`${
              user?.coverImage ? "Update cover image" : "Add cover image"
            }`}
          />
        </div>
        <div className="py-3">
          <CustomInputFile
            name="profileImage"
            label={`${
              user?.profileImage ? "Update profile image" : "Add profile image"
            }`}
          />
        </div>
      </CustomForm>
    </CustomModal>
  );
};

export default EditProfile;
