import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { set } from 'zod'

interface userData {
  id: string
  username: string
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  user: userData | null
  loading: boolean
  login: (userData: userData) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<userData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const checkAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5347/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error during initial auth check:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = (userData: userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5347/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log('User logged out successfully')
      } else {
        console.log('Backend logout failed', await response.text())
      }
    } catch (error) {
      console.error('Error during logout: ', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const contextValue: AuthState = {
    isAuthenticated,
    user,
    loading,
    login, // This `login` now just updates the frontend state
    logout, // This `logout` sends a request to clear the cookie
    checkAuth, // Expose checkAuth for manual re-checks if needed (e.g., after certain actions)
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
