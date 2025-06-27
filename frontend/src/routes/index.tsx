import Header from '@/components/Header'
import { createFileRoute, Link } from '@tanstack/react-router'
import styles from '../styles/index.module.css'
import Content from '@/components/Content'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className={styles.main}>
      {/* <Header /> */}
      <Content />
      <div className={styles.footer}></div>
    </div>
  )
}
