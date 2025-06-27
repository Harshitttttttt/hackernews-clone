import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header'
import styles from '../styles/contentBox.module.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div className={styles.contentBox}>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
