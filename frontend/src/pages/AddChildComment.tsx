import React from 'react';

type AddChildCommentProps = {
  content: string;
  postId: string;
  parent_comment_id: string;
};

const AddChildComment: React.FC<AddChildCommentProps> = ({
  content,
  postId,
  parent_comment_id,
}) => {
  return (
    <div>
      <pre>
        {JSON.stringify({ content, postId, parent_comment_id }, null, 2)}
      </pre>
    </div>
  );
};

export default AddChildComment;
