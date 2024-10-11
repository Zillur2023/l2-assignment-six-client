// PostCreator.tsx
'use client';

import React from 'react';
import { Button, useDisclosure } from '@nextui-org/react';
import CreatePostModal from './CreatePostModal'; // Adjust the import path accordingly

const PostCreate: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button auto onPress={onOpen}>
        Create Post
      </Button>
      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default PostCreate;
