import React from 'react'
import type { Comment } from '@/routes/post.$postId'
import styles from '../styles/commentItem.module.css'
import CommentList from './CommentList'

interface CommentItemProps {
  comment: Comment
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <>
      <div className={styles.main}>
        <span className={styles.upvote}>▲</span>
        <div className={styles.info}>
          <span>{comment.commentor_username + 'time'}</span>
          {' | '}
          <span>next</span> <span>[-]</span>
        </div>
        <div className={styles.comment}>{comment.content}</div>
        <span className={styles.replyButton}>reply</span>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div className={styles.childComments}>
          <CommentList comments={comment.children} />
        </div>
      )}
    </>
  )
}

export default CommentItem
