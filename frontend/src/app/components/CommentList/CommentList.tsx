import React, { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { CommentAPI } from "@/app/api/commentsAPI";
import styles from "./CommentList.module.scss";

interface CommentListProps {
  comments: CommentAPI[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(
    null
  );

  const handleToggleExpand = (id: number) => {
    setExpandedCommentId(expandedCommentId === id ? null : id);
  };

  const sortedComments = [...comments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={styles.commentList}>
      {sortedComments.map((comment) => {
        const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
        });
        const formattedDate = new Date(comment.createdAt);
        const now = new Date();
        const isOlderThanWeek =
          now.getTime() - formattedDate.getTime() > 7 * 24 * 60 * 60 * 1000;

        return (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentAvatar}>
              <img
                src="/default_avatar.jpg"
                alt="avatar"
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <p className={styles.commentAuthor}>{comment.authorName}</p>
                <p className={styles.commentTimestamp}>
                  {isOlderThanWeek
                    ? format(formattedDate, "dd MMM yyyy")
                    : timeAgo}
                </p>
              </div>
              <div className={styles.commentTextWrapper}>
                <p
                  className={`${styles.commentText} ${
                    expandedCommentId === comment.id ? styles.expanded : ""
                  }`}
                >
                  {comment.content}
                </p>
                {comment.content.length > 100 && (
                  <button
                    className={styles.viewMoreButton}
                    onClick={() => handleToggleExpand(comment.id)}
                  >
                    {expandedCommentId === comment.id
                      ? "View Less"
                      : "View More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
