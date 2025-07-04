import React from 'react';
import type { Comment } from '@/routes/post.$postId.ts';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId }) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentList;
