import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({
  children,
  navigate,
  redirectTo = '/login',
  fallbackPath = '/',
  requireAdmin = false,
  allowAccess = true,
  message,
}) {
  const { isAuthenticated, user, loading } = useAuth()

  // Verificar si el usuario tiene acceso
  const hasAccess = !requireAdmin || (user?.user === 'admin' && user?.password === 'admin')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, loading, navigate, redirectTo])

  useEffect(() => {
    if (!loading && isAuthenticated && requireAdmin && !hasAccess) {
      navigate('/')
    }
  }, [hasAccess, isAuthenticated, loading, navigate, requireAdmin])

  useEffect(() => {
    if (!loading && isAuthenticated && !allowAccess) {
      navigate(fallbackPath)
    }
  }, [allowAccess, fallbackPath, isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="state state--loading" role="status">
        <div className="spinner" aria-hidden="true" />
        <p>Validando permisos…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="state state--error" role="alert">
        <p>Necesitas iniciar sesión para continuar.</p>
        <button type="button" className="state__action" onClick={() => navigate('/login')}>
          Ir al login
        </button>
      </div>
    )
  }

  if (requireAdmin && !hasAccess) {
    return (
      <div className="state state--error" role="alert">
        <p>{message || 'No tienes permisos de administrador para acceder a esta sección.'}</p>
        <button type="button" className="state__action" onClick={() => navigate('/products')}>
          Explorar productos
        </button>
      </div>
    )
  }

  if (!allowAccess) {
    return (
      <div className="state state--error" role="alert">
        <p>{message || 'No tienes acceso a esta sección.'}</p>
        <button type="button" className="state__action" onClick={() => navigate(fallbackPath)}>
          Volver
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute