import { useEffect, useState } from 'react'
import styles from '../styles/content.module.css'
import PostItem from './PostItem'
import { env } from '../env'

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
  const [loading, setLoading] = useState(true) // State to indicate loading status
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const url = `${env.VITE_API_URL}/api/posts`
        const url = `/api/posts`
        const response = await fetch(url, {
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
        if (error instanceof Error) {
          setError(error.message) // Set error message
        } else {
          setError('An unknown error occurred while fetching content.')
          console.error('Unknown content fetch error:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) {
    return <div className={styles.loadingMessage}>Loading content...</div>
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>
  }

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
          postId={post.id}
          expanded={false}
        />
      ))}
    </div>
  )
}
