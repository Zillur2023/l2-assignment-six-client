import React from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import Posts from "../../components/post/Posts";
import CreatePost from "../../components/post/CreatePost";

const ProfilePage = () => {
  return (
    <>
      <ProfileHeader />
      <CreatePost />
      <Posts />
    </>
  );
};

export default ProfilePage;
