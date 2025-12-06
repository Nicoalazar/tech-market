import { Helmet } from 'react-helmet'
import Cart from '../components/Cart.jsx'
import { useCart } from '../context/CartContext.jsx'

function CartPage({ navigate }) {
  const { cartItems, removeItem, updateQuantity } = useCart()

  return (
    <div className="page">
      <Helmet>
        <title>Carrito | Tech Market</title>
        <meta name="description" content="Consulta el detalle de los productos añadidos al carrito." />
      </Helmet>
      <header className="section__header">
        <div>
          <h2>Resumen del carrito</h2>
          <p>Revisa tus productos antes de completar la compra.</p>
        </div>
      </header>
      <Cart items={cartItems} onRemove={removeItem} onUpdateQuantity={updateQuantity} navigate={navigate} />
    </div>
  )
}

export default CartPage
