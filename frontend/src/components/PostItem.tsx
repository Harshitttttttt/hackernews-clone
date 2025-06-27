import { Link } from '@tanstack/react-router'
import styles from '../styles/post_item.module.css'
import type { ZodString } from 'zod'
import { formatTimeAgo } from '@/utils/timeFormatter'

interface PostItemProps {
  rank: number // Rank is typically a number
  title: string
  url: string
  points: number // Points would be a number
  username: string
  time: string // Time in hours ago, so a number
  no_of_comments: number // Number of comments, so a number
  postId: string
  expanded: boolean
}

export default function PostItem({
  rank,
  title,
  url,
  points,
  username,
  time,
  no_of_comments,
  postId,
  expanded,
}: PostItemProps) {
  let displayUrl: string
  try {
    let safeUrl = url
    if (
      safeUrl &&
      !safeUrl.startsWith('http://') &&
      !safeUrl.startsWith('https://')
    ) {
      safeUrl = 'http://' + safeUrl
    }
    displayUrl = safeUrl ? new URL(safeUrl).hostname.replace('www.', '') : ''
  } catch (error) {
    console.error('Error parsing URL:', url, error)
    displayUrl = url
  }

  const formattedTimeAgo = formatTimeAgo(time)

  const handleFavourite = () => {
    console.log('Favouriting')
  }

  return (
    <div className={styles.main}>
      <div className={styles.voteColumn}>
        {rank === 0 ? <></> : <span className={styles.rank}>{rank}.</span>}
        <span className={styles.upvote}>▲</span>
      </div>
      <div className={styles.title_and_url}>
        {displayUrl ? (
          <Link to={url} className={styles.title}>
            {title}
          </Link>
        ) : (
          <Link to={url} className={styles.title}>
            Ask HN: {title}
          </Link>
        )}

        {displayUrl && (
          <span className={styles.url}>{'(' + displayUrl + ')'}</span>
        )}
      </div>
      <div className={styles.bottom}>
        <Link className={styles.point_user}>
          {points + ' points by ' + username}
        </Link>
        <Link className={styles.time}>{' ' + formattedTimeAgo}</Link>
        {' | '}
        <Link>hide</Link>
        {' | '}
        {expanded ? (
          <>
            <span className={styles.favourite} onClick={handleFavourite}>
              favourite
            </span>
            {' | '}
          </>
        ) : (
          <></>
        )}
        <Link to="/post/$postId" params={{ postId: postId }}>
          {no_of_comments + ' comments'}
        </Link>
      </div>
    </div>
  )
}
