"use client";

import React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import PostModal from "./PostModal";

const PostCreate: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button auto onPress={onOpen}>
        Create Post
      </Button>
      <PostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default PostCreate;
