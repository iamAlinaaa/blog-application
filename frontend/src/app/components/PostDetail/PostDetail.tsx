"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchPostAsync } from "@/app/redux/posts/postsSlice";
import { fetchCommentsAsync } from "@/app/redux/comments/commentsSlice";
import AddComment from "../AddComment/AddComment";
import CommentList from "../CommentList/CommentList";
import styles from "./PostDetail.module.scss";
import { useRouter } from "next/navigation";

interface PostDetailProps {
  id: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const post = useSelector((state: RootState) => {
    const foundPost = state.posts.posts.find((p) => p.id === Number(id));
    return foundPost || state.posts.currentPost;
  });

  const { loading, error } = useSelector((state: RootState) => state.posts);
  const comments = useSelector((state: RootState) => state.comments.comments);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const postContentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!post && !loading && !error) {
      dispatch(fetchPostAsync(id));
    }

    if (post && post.id) {
      dispatch(fetchCommentsAsync(post.id));
    }
  }, [dispatch, id, post, loading, error]);

  useEffect(() => {
    const checkTruncation = () => {
      if (postContentRef.current) {
        const contentHeight = postContentRef.current.scrollHeight;
        const visibleHeight = postContentRef.current.clientHeight;
        setIsTruncated(contentHeight > visibleHeight);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => window.removeEventListener("resize", checkTruncation);
  }, [post]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!loading && !post && error) {
      router.push("/");
    }
  }, [loading, post, error, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.postCommentsWrapper}>
        <div className={styles.post}>
          <div className={styles.postHeader}>
            <div className={styles.avatarName}>
              <div className={styles.postAvatar}>
                <img
                  src="/default_avatar.jpg"
                  alt="avatar"
                  className={styles.avatarImage}
                />
              </div>
              <p className={styles.postAuthor}>{post?.authorName}</p>
            </div>
            <p className={styles.postTimestamp}>
              {post?.createdAt && formatDate(post.createdAt)}
            </p>
          </div>

          <h1 className={styles.postTitle}>{post?.title}</h1>
          <p
            ref={postContentRef}
            className={`${styles.postContent} ${
              isExpanded ? styles.expanded : ""
            }`}
          >
            {post?.content}
          </p>
          {isTruncated && !isExpanded && (
            <button className={styles.expandButton} onClick={toggleExpanded}>
              View More
            </button>
          )}
          {isExpanded && (
            <button className={styles.expandButton} onClick={toggleExpanded}>
              View Less
            </button>
          )}
        </div>

        <div className={styles.commentsSection}>
          <h2 className={styles.commentsHeader}>Comments</h2>
          <AddComment postId={Number(id)} />
          {comments.length > 0 ? (
            <CommentList comments={comments} />
          ) : (
            <div className={styles.noComments}>No comments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
