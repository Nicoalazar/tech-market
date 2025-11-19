import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, navigate, redirectTo = '/login', allowAccess = true, message }) {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, loading, navigate, redirectTo])

  useEffect(() => {
    if (!loading && isAuthenticated && !allowAccess && redirectTo) {
      navigate(redirectTo)
    }
  }, [allowAccess, isAuthenticated, loading, navigate, redirectTo])

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

  if (!allowAccess) {
    return (
      <div className="state state--error" role="alert">
        <p>{message || 'No cuentas con los permisos necesarios para esta sección.'}</p>
        <button type="button" className="state__action" onClick={() => navigate('/products')}>
          Explorar productos
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
