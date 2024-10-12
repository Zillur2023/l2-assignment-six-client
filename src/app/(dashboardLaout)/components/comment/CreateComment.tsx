"use client";

import React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import CommentModal from "./CommentModal";

const PostComment: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button auto onPress={onOpen}>
        {/* Create Comment */}
      </Button>
      <CommentModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default PostComment;