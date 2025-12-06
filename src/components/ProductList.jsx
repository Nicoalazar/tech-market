import { FiShoppingCart } from 'react-icons/fi'
import { formatCurrency } from '../utils/formatters.js'

function ProductList({ products = [], onAddToCart, loading = false, error = null, navigate }) {
  if (loading) {
    return (
      <div className="state state--loading" role="status">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando productos…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <p>Ocurrió un problema al cargar los productos.</p>
        <p className="state__details">{error}</p>
        <button type="button" onClick={() => navigate('/')} className="state__action">
          Volver al inicio
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="state state--empty" role="status">
        <p>No encontramos coincidencias con tu búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <article key={product.id} className="product-card">
          <img src={product.image} alt={product.title} className="product-card__image" loading="lazy" />
          <div className="product-card__body">
            <p className="product-card__category">{product.category}</p>
            <h3 className="product-card__title">{product.title}</h3>
            <p className="product-card__description">{product.description}</p>
          </div>
          <div className="product-card__footer">
            <span className="product-card__price">{formatCurrency(product.price)}</span>
            <div className="product-card__actions">
              <button type="button" onClick={() => navigate(`/products/${product.id}`)}>
                Ver detalle
              </button>
              <button type="button" className="product-card__add" onClick={() => onAddToCart(product)}>
                <FiShoppingCart aria-hidden="true" /> Agregar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ProductList
