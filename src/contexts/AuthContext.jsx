import { createContext, useContext, useState, useEffect } from 'react'
import { isValidRole } from '@/lib/mock-data'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      // Validate role exists and is valid
      if (parsed && parsed.role && isValidRole(parsed.role)) {
        return parsed
      }
    }
    return null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(!!user)

  useEffect(() => {
    if (user) {
      // Validate role before storing
      if (!isValidRole(user.role)) {
        console.error('Invalid role detected, logging out user')
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        return
      }
      localStorage.setItem('user', JSON.stringify(user))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('user')
      setIsAuthenticated(false)
    }
  }, [user])

  const login = (userData) => {
    // Validate role before login
    if (!userData || !userData.role || !isValidRole(userData.role)) {
      throw new Error('Invalid user role. User must have a valid role (technician, operator, or manager)')
    }
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

