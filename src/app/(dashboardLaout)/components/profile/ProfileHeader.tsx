"use client"
import React, { useState } from 'react';
import Image from 'next/image';
// import coverPhoto from '../public/cover-photo.jpg'; // Example of a local image
// import profileImage from '../public/profile-image.jpg';

const ProfileHeader = () => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="relative">
        <Image
          src='https://scontent.fdac8-1.fna.fbcdn.net/v/t39.30808-6/454374554_1271713357133015_1414141773785030702_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QBXGDsjRHNoQ7kNvgHYkk3u&_nc_ht=scontent.fdac8-1.fna&_nc_gid=AAp55v3m0diF_KAGVWSp4tY&oh=00_AYCXh4BY_8JCuDLqfpo74hBKlXQaeAyrJvJKdE7K7V9FFw&oe=670E3661'
          alt="Cover"
          width={800}
          height={100}
          className=" h-24 w-full object-cover rounded-t-lg"
          layout="responsive"
        />
        <div className="absolute -bottom-16 left-6">
          <Image
            src='https://scontent.fdac8-1.fna.fbcdn.net/v/t39.30808-6/454374554_1271713357133015_1414141773785030702_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QBXGDsjRHNoQ7kNvgHYkk3u&_nc_ht=scontent.fdac8-1.fna&_nc_gid=AAp55v3m0diF_KAGVWSp4tY&oh=00_AYCXh4BY_8JCuDLqfpo74hBKlXQaeAyrJvJKdE7K7V9FFw&oe=670E3661'
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="px-6 pt-16 pb-6">
        <h2 className="text-3xl font-bold">John Doe</h2>
        <p className="text-gray-500">@johndoe</p>
        <div className="flex space-x-4 mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Follow</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Message</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
