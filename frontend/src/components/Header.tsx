import { Link, useNavigate } from '@tanstack/react-router'
import styles from '../styles/header.module.css'
import HackerNewsIcon from '../assets/y18.svg?react'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated: isLoggedIn, user, logout } = useAuth()

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await logout()
  }

  const username = user?.username
  const karma = user?.karma

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <div className={styles.header}>
        <div className={styles.hn_nav_left}>
          <Link to="/">
            <HackerNewsIcon
              style={{
                border: '1px solid #ffffff',
                marginLeft: '2px',
                verticalAlign: 'middle',
              }}
            />
          </Link>
          <Link to="/" className={styles.title}>
            Hacker News
          </Link>
          <Link to="/newest">new</Link>
          {' | '}
          <Link to="/front">past</Link>
          {' | '}
          <Link to="/newcomments">comments</Link>
          {' | '}
          <Link to="/ask">ask</Link>
          {' | '}
          <Link to="/show">show</Link>
          {' | '}
          <Link to="/submit">submit</Link>
        </div>
        <div className={styles.hn_nav_right}>
          {!isLoggedIn ? (
            <Link to="/login">login</Link>
          ) : (
            <>
              <Link to="/user-profile" className={styles.usernameLink}>
                {username + ' ' + `(${karma})`}
              </Link>
              {' | '}
              <span onClick={handleLogout} className={styles.logoutLink}>
                logout
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
