"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsAsync,
  deletePostAsync,
  updatePostAsync,
} from "../../redux/posts/postsSlice";
import { RootState } from "../../redux/store";
import { AppDispatch } from "../../redux/store";
import Link from "next/link";
import CreatePost from "../CreatePost/CreatePost";
import { formatDistanceToNow, format } from "date-fns";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "./PostList.module.scss";

const PostList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [updatedContent, setUpdatedContent] = useState<string>("");

  useEffect(() => {
    dispatch(fetchPostsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (editingPostId) {
      const postToUpdate = posts.find((post) => post.id === editingPostId);
      if (postToUpdate) {
        setUpdatedTitle(postToUpdate.title);
        setUpdatedContent(postToUpdate.content);
      }
    }
  }, [editingPostId, posts]);

  if (loading)
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const reversedPosts = [...posts].reverse();

  const truncateContent = (content: string, limit: number) => {
    return content.length > limit ? content.slice(0, limit) + "..." : content;
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await dispatch(deletePostAsync(postId)).unwrap();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = async (postId: number) => {
    try {
      if (updatedTitle.trim() === "" || updatedContent.trim() === "") {
        alert("Title and content cannot be empty.");
        return;
      }

      const postToUpdate = posts.find((post) => post.id === postId);
      if (postToUpdate) {
        await dispatch(
          updatePostAsync({
            id: postId,
            title: updatedTitle,
            content: updatedContent,
            authorName: postToUpdate.authorName,
            createdAt: postToUpdate.createdAt,
          })
        ).unwrap();

        setEditingPostId(null);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.createPostForm}>
        <CreatePost />
      </div>
      <div className={styles.postList}>
        {reversedPosts.map((post) => {
          const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          });
          const formattedDate = new Date(post.createdAt);
          const now = new Date();
          const isOlderThanWeek =
            now.getTime() - formattedDate.getTime() > 7 * 24 * 60 * 60 * 1000;

          return (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.postMeta}>
                  <div className={styles.avatarName}>
                    <div className={styles.postAvatar}>
                      <img
                        src="/default_avatar.jpg"
                        alt="avatar"
                        className={styles.avatarImage}
                      />
                    </div>
                    <p className={styles.postAuthor}>{post.authorName}</p>
                  </div>
                  <p className={styles.postTimestamp}>
                    {isOlderThanWeek
                      ? format(formattedDate, "dd MMM yyyy")
                      : timeAgo}
                  </p>
                </div>

                {editingPostId === post.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className={styles.editTitle}
                    />
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      className={styles.editContent}
                    />
                    <div className={styles.editCancelButtons}>
                      <button
                        onClick={() => handleUpdatePost(post.id)}
                        className={styles.saveButton}
                        disabled={!updatedTitle || !updatedContent}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Link
                      href={`/posts/${post.id}`}
                      className={styles.linkWrapper}
                    >
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p>{truncateContent(post.content, 150)}</p>
                    </Link>
                  </div>
                )}
              </div>

              {editingPostId === post.id ? (
                <></>
              ) : (
                <div className={styles.actions}>
                  <button
                    onClick={() => setEditingPostId(post.id)}
                    className={styles.editButton}
                  >
                    <FaEdit className={styles.editIcon} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    className={styles.deleteButton}
                  >
                    <FaTrashAlt className={styles.deleteIcon} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostList;
