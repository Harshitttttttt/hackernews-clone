import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import styles from '../styles/submit.module.css';
import HackerNewsIcon from '../assets/y18.svg?react';
import SubmitBody from '@/components/SubmitBody';
import { env } from '@/env';

export const Route = createFileRoute('/submit')({
  beforeLoad: async ({ location }) => {
    try {
      // Make an API call to your profile endpoint
      // The browser automatically sends the httpOnly 'jwt' cookie
      // const url = `${env.VITE_API_URL}/api/users/profile`
      const url = '/api/users/profile';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });

      console.log('Response from beforeLoad: ', response);
      console.log(response.ok);

      if (response.ok == false) {
        // If the response is not OK (e.g., 401 Unauthorized), it means the user is not authenticated.
        console.log(
          'User not authenticated for /submit route. Redirecting to login.',
        );
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href, // Pass the current URL so the user can return here after login
            authError: 'You must be logged in to submit a post.',
          },
        });
      }

      // If response is OK (200), user is authenticated.
      // You can optionally return the user data from the profile endpoint
      // for this route's loader data if the component needs it, but it's not strictly necessary for auth check.
      // const user = await response.json();
      // return { user }; // This would make user data available via `useLoaderData<typeof Route>()`
    } catch (error) {
      console.error('Error during /submit beforeLoad auth check:', error);
      // In case of network error or other issues during fetch, still redirect to login
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
          authError: 'Authentication check failed. Please log in.',
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.submitPage}>
      {/* <div className={styles.header}>
        <div className={styles.hn_nav_left}>
          <HackerNewsIcon
            style={{
              border: '1px solid #ffffff',
              marginLeft: '2px',
              verticalAlign: 'middle',
            }}
          />
        </div>
      </div> */}
      <SubmitBody />
    </div>
  );
}
