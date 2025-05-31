import Header from '@/components/Header'
import { createFileRoute, Link } from '@tanstack/react-router'
import styles from '../styles/index.module.css'
import { useContext, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Content from '@/components/Content'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className={styles.main}>
      <Header />
      <Content />
      <div className={styles.footer}></div>
    </div>
  )
}
