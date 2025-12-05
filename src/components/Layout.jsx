import styled from 'styled-components'
import { FiLogIn, FiLogOut, FiShoppingCart, FiShield, FiUser } from 'react-icons/fi'
import Cart from './Cart.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'

const HeaderBar = styled.header`
  background: linear-gradient(90deg, #111827, #1f2937);
  color: #ffffff;
  padding: 1rem 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.35);
`

const BrandButton = styled.button`
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 1.75rem;
  font-weight: 700;
  cursor: pointer;
`

const NavButton = styled.button`
  background: transparent;
  border: 0;
  color: #cbd5f5;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.35rem 0.75rem;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;

  &.is-active,
  &:hover,
  &:focus {
    color: #ffffff;
    border-color: #22d3ee;
    outline: none;
  }
`

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-size: 0.9rem;
`

function Layout({ children, currentPath, navigate }) {
  const { cartItems, removeItem, updateQuantity, cartCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="app-shell">
      <HeaderBar>
        <div className="container">
          <div className="row align-items-center gy-2">
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <BrandButton type="button" onClick={() => navigate('/')}>Tech Market</BrandButton>
            </div>
            <div className="col-12 col-md-5 d-flex gap-3 justify-content-center">
              <NavButton type="button" onClick={() => navigate('/')} className={currentPath === '/' ? 'is-active' : ''}>
                Inicio
              </NavButton>
              <NavButton
                type="button"
                onClick={() => navigate('/products')}
                className={currentPath.startsWith('/products') ? 'is-active' : ''}
              >
                Productos
              </NavButton>
              <NavButton
                type="button"
                onClick={() => navigate('/cart')}
                className={currentPath === '/cart' ? 'is-active' : ''}
                aria-label="Ir al carrito"
              >
                <FiShoppingCart aria-hidden="true" /> ({cartCount})
              </NavButton>
              <NavButton
                type="button"
                onClick={() => navigate('/admin')}
                className={currentPath === '/admin' ? 'is-active' : ''}
              >
                <FiShield aria-hidden="true" /> Admin
              </NavButton>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end gap-2">
              {isAuthenticated ? (
                <>
                  <span className="user-chip">
                    <FiUser aria-hidden="true" /> {user?.user}
                  </span>
                  <button type="button" className="button button--ghost" onClick={logout}>
                    <FiLogOut aria-hidden="true" /> Salir
                  </button>
                </>
              ) : (
                <button type="button" className="button button--ghost" onClick={() => navigate('/login')}>
                  <FiLogIn aria-hidden="true" /> Ingresar
                </button>
              )}
            </div>
          </div>
        </div>
      </HeaderBar>
      <div className="container py-4">
        <div className="row g-4">
          <div className={isAuthenticated && cartItems.length > 0 ? 'col-12 col-lg-8' : 'col-12'}>
            {children}
          </div>
          {isAuthenticated && cartItems.length > 0 && (
            <div className="col-12 col-lg-4">
              <Cart
                items={cartItems}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
                navigate={navigate}
                compact
              />
            </div>
          )}
        </div>
      </div>
      <Footer>
        <p>© {new Date().getFullYear()} Tech Market. Todos los derechos reservados.</p>
      </Footer>
      <ToastContainer />
    </div>
  )
}

export default Layout
