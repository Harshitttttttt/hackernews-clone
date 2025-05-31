import { useEffect, useState } from 'react'
import styles from '../styles/content.module.css'
import PostItem from './PostItem'

interface Post {
  id: string
  title: string
  url: string
  content: string
  user_id: string
  creator_username: string
  score: number
  comment_count: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export default function Content() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5347/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        } else {
          const data = await response.json()
          console.log(data)
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className={styles.main}>
      {posts.map((post, index) => (
        <PostItem
          key={post.id}
          rank={index + 1}
          title={post.title}
          url={post.url}
          no_of_comments={post.comment_count}
          points={post.score}
          time={post.createdAt}
          username={post.creator_username}
        />
      ))}
    </div>
  )
}
