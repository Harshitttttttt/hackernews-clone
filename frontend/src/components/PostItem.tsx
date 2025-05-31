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
}

export default function PostItem({
  rank,
  title,
  url,
  points,
  username,
  time,
  no_of_comments,
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

  return (
    <div className={styles.main}>
      {/* <div className={styles.top}> */}
      <div className={styles.voteColumn}>
        <span className={styles.rank}>{rank}.</span>
        <span className={styles.upvote}>▲</span>
      </div>
      <div className={styles.title_and_url}>
        <span className={styles.title}>{title}</span>
        <span className={styles.url}>{'(' + displayUrl + ')'}</span>
      </div>
      {/* </div> */}
      <div className={styles.bottom}>
        <Link className={styles.point_user}>
          {points + ' points by ' + username}
        </Link>
        <Link className={styles.time}>{' ' + formattedTimeAgo}</Link>
        {' | '}
        <Link>hide</Link>
        {' | '}
        <Link>{no_of_comments + ' comments'}</Link>
      </div>
    </div>
  )
}
