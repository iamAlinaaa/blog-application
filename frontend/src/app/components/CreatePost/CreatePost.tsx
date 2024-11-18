"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addPostAsync } from "../../redux/posts/postsSlice";
import { AppDispatch } from "../../redux/store";
import styles from "./CreatePost.module.scss";

const CreatePost: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => setIsExpanded(true);

  const handleCollapse = () => {
    if (!title && !content) {
      setIsExpanded(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && authorName) {
      dispatch(addPostAsync({ title, content, authorName }));
      setTitle("");
      setContent("");
      setAuthorName("");
      setIsExpanded(false);
    }
  };

  return (
    <form
      ref={formRef}
      className={`${styles.createPostForm} ${isExpanded ? "" : styles.compact}`}
      onSubmit={handleSubmit}
    >
      {!isExpanded ? (
        <input
          className={styles.inputField}
          type="text"
          placeholder="What's up?"
          value={title}
          onFocus={handleExpand}
          readOnly
        />
      ) : (
        <>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className={styles.textareaField}
            placeholder="What's new?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleCollapse}
            >
              Cancel
            </button>
            <button className={styles.submitButton} type="submit">
              Post
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default CreatePost;
