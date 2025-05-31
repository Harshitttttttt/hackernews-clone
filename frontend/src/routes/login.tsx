import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import styles from '../styles/login.module.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  // Get login, isAuthenticated, loading, AND checkAuth from useAuth
  const { login: authLogin, isAuthenticated, loading, checkAuth } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('User already logged in, redirecting to home.')
      navigate({ to: '/' })
    }
  }, [loading, isAuthenticated, navigate])

  // Login States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Register States
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [username, setUsername] = useState('')
  const [registerError, setRegisterError] = useState('')

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoginError('')

    // Client-side validation for login
    if (!loginEmail || !loginPassword) {
      setLoginError('Email and password are required.')
      return
    }

    console.log('Login Attempt: ', {
      email: loginEmail,
      password: loginPassword,
    })

    const url = 'http://localhost:5347/api/users/login'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      if (!response.ok) {
        let errorMessage = `Login failed (Status: ${response.status})`
        try {
          const errorData = await response.json()
          console.log(errorData)
          if (errorData.message) {
            errorMessage = errorData.message // Use backend's specific error message
          } else if (
            errorData.errors &&
            Array.isArray(errorData.errors) &&
            errorData.errors.length > 0
          ) {
            // For validation errors often returned as an array of errors
            errorMessage = errorData.errors
              .map((err: any) => err.msg || err.message)
              .join(', ')
          }
        } catch (jsonError) {
          // If response is not JSON, use generic message
          console.error('Failed to parse error response:', jsonError)
        }
        throw new Error(errorMessage)
      }

      const json = await response.json()
      console.log(json)
      console.log(json.user)

      if (json.user) {
        authLogin(json.user)
      } else {
        throw new Error('Login successful, but no user data sent from backend.')
      }

      navigate({ to: '/' })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        setLoginError(error.message)
      } else {
        setLoginError('An unknown error occurred during login.')
        console.error('An unknown error occurred during login:', error)
      }
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setRegisterError('')

    console.log('Register Attempt: ', {
      username: username,
      email: registerEmail,
      password: registerPassword,
    })

    // Client-side validation for registration
    if (!username || !registerEmail || !registerPassword) {
      setRegisterError('All fields are required.')
      return
    }

    if (username.length <= 3) {
      setRegisterError('Username must be greater than 3 characters.')
      return
    }

    if (registerPassword.length <= 8) {
      setRegisterError('Password must be greater than 8 characters.')
      return
    }

    // Basic email format validation (can be more robust)
    if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      setRegisterError('Please enter a valid email address.')
      return
    }

    const url = 'http://localhost:5347/api/users/register'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: registerEmail,
          password: registerPassword,
        }),
      })
      if (!response.ok) {
        let errorMessage = `Registration failed (Status: ${response.status})`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message // Use backend's specific error message
          } else if (
            errorData.errors &&
            Array.isArray(errorData.errors) &&
            errorData.errors.length > 0
          ) {
            // For validation errors often returned as an array of errors
            errorMessage = errorData.errors
              .map((err: any) => err.msg || err.message)
              .join(', ')
          }
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError)
        }
        throw new Error(errorMessage)
      }

      const json = await response.json()
      console.log(json)
      setUsername('')
      setRegisterEmail('')
      setRegisterPassword('')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Registration Error:', error.message)
        setRegisterError(error.message) // Display error to the user
      } else {
        setRegisterError('An unknown error occurred during registration.')
        console.error('An unknown error occurred during registration:', error)
      }
    }
  }

  if (loading || isAuthenticated) {
    return null
  }

  return (
    <div className={styles.main}>
      <p className={styles.label_text}>Login</p>
      <form action="login" className={styles.form} onSubmit={handleLoginSubmit}>
        {loginError && <p className={styles.errorMessage}>{loginError}</p>}
        <div>
          email:{' '}
          <input
            type="text"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div>
          password:{' '}
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
        <Link to="/forgot-password">
          <p>Forgot your password?</p>
        </Link>
      </form>

      <p className={styles.label_text}>Create Account</p>
      <form
        action="register"
        onSubmit={handleRegisterSubmit}
        className={styles.form}
      >
        {registerError && (
          <p className={styles.errorMessage}>{registerError}</p>
        )}
        <div>
          username:{' '}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          email:{' '}
          <input
            type="text"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </div>
        <div>
          password:{' '}
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </div>
        <button type="submit">create account</button>
      </form>
    </div>
  )
}
