  import { createContext,  useState, useEffect } from 'react'
  import { decodeToken, isTokenValid } from '../utils/auth'

  type AuthContextType = {
    isAuthenticated: boolean
    user: any | null
     token: string | null
    login: (token: string) => void
    logout: () => void
    loading:boolean
    
  }

  export const AuthContext = createContext<AuthContextType | null>(null)

  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading,setLoading]=  useState(true)
    
    useEffect(() => {
      const storedToken = localStorage.getItem('token')
    console.log('TOKEN ON LOAD:', storedToken)
    console.log('VALID?', isTokenValid(storedToken ?? ''))
    if (storedToken && isTokenValid(storedToken)) {
      const decoded = decodeToken(storedToken)
      setUser(decoded)
      setToken(storedToken)
    }
    setLoading(false);
    }, [])

    const login = (newToken: string) => {
      localStorage.setItem('token', newToken)
       setToken(newToken)
      const decoded = decodeToken(newToken)
      setUser(decoded)
    }

    const logout = () => {
      localStorage.removeItem('token')
      setUser(null)
      setToken(null)
    }

    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated: !!user,
          login,
          logout,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  
