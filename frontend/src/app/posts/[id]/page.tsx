import React from "react";
import { fetchPostAsync } from "@/app/redux/posts/postsSlice";
import PostDetail from "@/app/components/PostDetail/PostDetail";
import { store } from "@/app/redux/store";

interface PostDetailProps {
  params: { id: string };
}

const PostDetailServer: React.FC<PostDetailProps> = async ({ params }) => {
  const { id } = await params;

  await store.dispatch(fetchPostAsync(id));

  return (
    <>
      <div className="background-image" />
      <PostDetail id={id} />
    </>
  );
};

export default PostDetailServer;
