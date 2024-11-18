import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCommentAsync } from "@/app/redux/comments/commentsSlice";
import { AppDispatch } from "@/app/redux/store";
import styles from "./AddComment.module.scss";

interface AddCommentProps {
  postId: number;
}

const AddComment: React.FC<AddCommentProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(event.target.value);
  };

  const handleAddComment = async () => {
    if (commentText.trim() && authorName.trim()) {
      const newComment = {
        postId,
        content: commentText,
        authorName,
        createdAt: new Date().toISOString(),
      };

      try {
        await dispatch(addCommentAsync(newComment));

        setCommentText("");
        setAuthorName("");
      } catch (error) {
        console.error("Failed to add comment:", error);
        alert("An error occurred while adding the comment. Please try again.");
      }
    } else {
      alert("Please provide both a name and a comment!");
    }
  };

  return (
    <div className={styles.addCommentWrapper}>
      <input
        type="text"
        value={authorName}
        onChange={handleNameChange}
        placeholder="Your name"
        className={styles.nameInput}
      />
      <textarea
        value={commentText}
        onChange={handleCommentChange}
        placeholder="Add a comment..."
        className={styles.commentInput}
      />
      <button onClick={handleAddComment} className={styles.addCommentButton}>
        Add Comment
      </button>
    </div>
  );
};

export default AddComment;
