import { createContext, useContext, useState, useEffect } from 'react'
import { decodeToken, isTokenValid } from '../utils/auth'

type AuthContextType = {
  isAuthenticated: boolean
  user: any | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isTokenValid(token)) {
      const decoded = decodeToken(token)
      setUser(decoded)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    const decoded = decodeToken(token)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
