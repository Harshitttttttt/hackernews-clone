import { createFileRoute, useMatch, useNavigate } from '@tanstack/react-router';
import styles from '../styles/postPage.module.css';
import PostItem from '@/components/PostItem';
import CommentList from '@/components/CommentList';
import { useState, type ReactEventHandler } from 'react';
import { Outlet } from '@tanstack/react-router';

export interface Post {
  id: string;
  title: string;
  url: string;
  content: string;
  user_id: string;
  creator_username: string;
  score: number;
  comment_count: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  commentor_username: string;
  post_id: string;
  parent_comment_id: string;
  score: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}

interface CommentApiResponse {
  message: string;
  comments: Comment[];
}

interface PostAndComment {
  post: Post;
  comments: Comment[];
}

interface CreateCommentResponse {
  message: string;
  comment: Comment;
}

export const Route = createFileRoute('/post/$postId')({
  loader: async ({ params }) => {
    const postId = params.postId;
    try {
      const postUrl = `/api/posts/${postId}`;
      const postResponse = await fetch(postUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch post');
      }

      const commentUrl = `/api/comments/${postId}`;
      const commentResponse = await fetch(commentUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentResponse.ok) {
        throw new Error('Failed to fetch comments');
      }

      const post = await postResponse.json();
      // const comments = await commentResponse.json()
      const commentApiResponse: CommentApiResponse =
        await commentResponse.json();
      const comments: Comment[] = commentApiResponse.comments; // <--- This is the key change!

      const loaderData: PostAndComment = {
        post: post,
        comments: comments,
      };

      return loaderData;
    } catch (error) {
      console.error('Failed to load post or comments:', error);
      // You might want to throw an error or return an error state
      throw new Error('Failed to load post details or comments.');
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { post, comments } = Route.useLoaderData();
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const navigate = useNavigate();

  const addRootComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const url = `/api/comments/create`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId: post.id,
          parent_comment_id: null,
        }),
      });

      if (!response.ok) {
        console.log('Error adding comment');
      }

      const newComment: CreateCommentResponse = await response.json();
      setCommentList([...commentList, newComment.comment]);

      setComment('');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={styles.main}>
      <div>
        <PostItem
          key={post.id}
          rank={0}
          title={post.title}
          url={post.url}
          no_of_comments={post.comment_count}
          points={post.score}
          time={post.createdAt}
          username={post.creator_username}
          postId={post.id}
          expanded={true}
        />
      </div>
      <div className={styles.postContent}>{post.content}</div>
      <div className={styles.addComment}>
        <textarea
          className={styles.commentBox}
          rows={8}
          cols={80}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className={styles.addCommentButton}
          onClick={(e) => addRootComment(e)}
        >
          add comment
        </button>
      </div>
      <div className={styles.commentList}>
        <CommentList comments={commentList} postId={post.id} />
      </div>
      <Outlet />
    </div>
  );
}
