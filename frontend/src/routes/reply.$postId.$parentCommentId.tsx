import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import styles from '../styles/reply.module.css';
import type { Comment } from './post.$postId';
import type { Post } from './post.$postId';

export const Route = createFileRoute('/reply/$postId/$parentCommentId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const postId = params.postId;
    const parent_comment_id = params.parentCommentId;
    try {
      const commentUrl = `/api/comments/comment/${parent_comment_id}`;
      const commentResponse = await fetch(commentUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentResponse.ok) {
        throw new Error('Failed to fetch Comment');
      }

      console.log(postId);
      const postUrl = `/api/posts/${postId}`;
      const postResponse = await fetch(postUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch Post');
      }

      const comment = await commentResponse.json();
      console.log(comment);

      const post = await postResponse.json();

      return { post, comment, ...params };
    } catch (error) {
      throw new Error('Error fetching Comment');
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const comment: Comment = data.comment[0];
  const post: Post = data.post;
  const postId = data.postId;
  const parent_comment_id = data.parentCommentId;
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const handleReply = async () => {
    try {
      const url = `/api/comments/create`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          content: reply,
          parent_comment_id: parent_comment_id,
        }),
      });

      if (!response.ok) {
        throw new Error('');
      }
    } catch (error) {}
  };

  return (
    <div className={styles.main}>
      <div className={styles.upvoteButton}>▲</div>
      <div className={styles.right}>
        <div className={styles.info}>
          <Link to="user-profile">{comment.commentor_username}</Link>
          <span>8 hours ago</span>
          <span>&nbsp;|&nbsp;</span>
          <Link to={`/post/$postId`} params={{ postId: postId }}>
            parent
          </Link>
          <span>&nbsp;|&nbsp;</span>
          <Link
            to="/post/$postId"
            params={{ postId }}
            hash={`comment-${parent_comment_id}`}
          >
            context
          </Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to={`/post/$postId`} params={{ postId: postId }}>
            on: {post.content.substring(0, 20)}...
          </Link>
        </div>
        <div className={styles.mainComment}>{comment.content}</div>
        <textarea
          rows={8}
          cols={80}
          className={styles.input}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        ></textarea>
        <button className={styles.replyButton} onClick={(e) => handleReply()}>
          reply
        </button>
      </div>
    </div>
  );
}
