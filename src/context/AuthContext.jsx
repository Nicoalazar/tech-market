import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext()
const AUTH_STORAGE_KEY = 'tech_market_user'

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('No fue posible recuperar el usuario almacenado:', error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = ({ email, name }) => {
    const trimmedEmail = email?.trim()

    if (!trimmedEmail) {
      throw new Error('El correo es obligatorio para iniciar sesión')
    }

    const normalizedUser = {
      email: trimmedEmail,
      name: name?.trim() || trimmedEmail.split('@')[0] || 'Usuario',
      loggedAt: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser))
      } catch (storageError) {
        console.error('No fue posible persistir la sesión:', storageError)
      }
    }

    setUser(normalizedUser)
    return normalizedUser
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      } catch (storageError) {
        console.error('No fue posible limpiar la sesión:', storageError)
      }
    }

    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      loading,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}
