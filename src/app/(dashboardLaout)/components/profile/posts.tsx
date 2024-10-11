'use client'
import React, { useState } from 'react';
import Image from 'next/image'; // Import Next.js image component for optimization
import { Button } from '@nextui-org/react'; // Import only NextUI Button
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'; // Import Lucide-react icons

const Posts = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "This is my first post! #travel",
      likes: 10,
      comments: 5,
      shares: 3,
      image: 'https://via.placeholder.com/600x400',
    },
    {
      id: 2,
      content: "Enjoying the beautiful sunset!",
      likes: 25,
      comments: 8,
      shares: 6,
      image: 'https://via.placeholder.com/600x400',
    },
  ]);

  return (
    <div className="mt-6">
      {posts.map((post) => (
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
            <Button auto light size="sm" className="flex items-center space-x-2">
              <ThumbsUp size={18} />
              <span>{post.likes}</span>
            </Button>

            <Button auto light size="sm" className="flex items-center space-x-2">
              <MessageCircle size={18} />
              <span>{post.comments}</span>
            </Button>

            <Button auto light size="sm" className="flex items-center space-x-2">
              <Share2 size={18} />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;

