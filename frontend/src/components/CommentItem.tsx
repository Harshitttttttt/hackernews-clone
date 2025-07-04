import React from 'react';
import type { Comment } from '@/routes/post.$postId';
import styles from '../styles/commentItem.module.css';
import CommentList from './CommentList';
import { Link, useNavigate } from '@tanstack/react-router';

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId }) => {
  return (
    <div id={`comment-${comment.id}`}>
      <div className={styles.main}>
        <span className={styles.upvote}>▲</span>
        <div className={styles.info}>
          <span>{comment.commentor_username + 'time'}</span>
          {' | '}
          <span>next</span> <span>[-]</span>
        </div>
        <div className={styles.comment}>{comment.content}</div>
        <Link
          to="/reply/$postId/$parentCommentId"
          params={{
            postId: postId,
            parentCommentId: comment.id,
          }}
          className={styles.replyButton}
          onClick={() => alert(`Replying to ${comment.id}`)}
        >
          reply
        </Link>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div className={styles.childComments}>
          <CommentList comments={comment.children} postId={postId} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
