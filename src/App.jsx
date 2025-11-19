import { useEffect, useState } from 'react'
import './App.css'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { useCart } from './context/CartContext.jsx'

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  const hash = window.location.hash.replace('#', '')
  if (!hash) {
    return '/'
  }

  return hash.startsWith('/') ? hash : `/${hash}`
}

function normalizePath(path) {
  if (!path) {
    return '/'
  }

  return path.startsWith('/') ? path : `/${path}`
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath())
  const { cartItems } = useCart()

  const navigate = (path) => {
    if (typeof window === 'undefined') {
      return
    }

    const target = normalizePath(path)
    const actual = getCurrentPath()

    if (target !== actual) {
      window.location.hash = target
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const handleHashChange = () => {
      setCurrentPath(getCurrentPath())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderCurrentScreen = () => {
    if (currentPath === '/') {
      return <HomePage navigate={navigate} />
    }

    if (currentPath === '/products') {
      return <ProductsPage navigate={navigate} />
    }

    if (currentPath.startsWith('/products/')) {
      const [, , productId = ''] = currentPath.split('/')
      return <ProductDetailPage navigate={navigate} productId={productId} />
    }

    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />
    }

    if (currentPath === '/cart') {
      return (
        <ProtectedRoute navigate={navigate}>
          <CartPage navigate={navigate} />
        </ProtectedRoute>
      )
    }

    if (currentPath === '/checkout') {
      return (
        <ProtectedRoute
          navigate={navigate}
          allowAccess={cartItems.length > 0}
          message="Tu carrito está vacío. Agrega productos antes de continuar."
          redirectTo="/cart"
        >
          <CheckoutPage navigate={navigate} />
        </ProtectedRoute>
      )
    }

    if (currentPath === '/admin') {
      return (
        <ProtectedRoute navigate={navigate}>
          <AdminPage navigate={navigate} />
        </ProtectedRoute>
      )
    }

    return <NotFoundPage navigate={navigate} />
  }

  return (
    <Layout currentPath={currentPath} navigate={navigate}>
      {renderCurrentScreen()}
    </Layout>
  )
}

export default App
