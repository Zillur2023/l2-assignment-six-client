import React from 'react'
import ProfileHeader from '../../components/profile/ProfileHeader'
import Posts from '../../components/profile/posts'
import CreatePost from '../../components/profile/CreatePost'

const ProfilePage = () => {
  

  return (
    <>
    <ProfileHeader/>
   <CreatePost/>
    <Posts/>
    </>
  )
}

export default ProfilePage