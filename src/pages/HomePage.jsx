import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import ProductList from '../components/ProductList.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'

function HomePage({ navigate }) {
  const { products, loading, error } = useProducts()
  const { addItem } = useCart()
  const featuredProducts = products.slice(0, 4)

  const handleAddToCart = (product) => {
    addItem(product)
    toast.success(`${product.title} se agregó a tu carrito`)
  }

  return (
    <div className="page">
      <Helmet>
        <title>Tech Market | Tecnología inteligente</title>
        <meta name="description" content="Explora los lanzamientos más recientes en tecnología y accesorios inteligentes." />
      </Helmet>
      <section className="hero">
        <div>
          <p className="eyebrow">Tecnología para todos</p>
          <h2>Bienvenido a Tech Market</h2>
          <p>
            Descubre la mejor selección de productos tecnológicos, accesorios y gadgets.
            Explora nuestro catálogo y lleva tu experiencia digital al siguiente nivel.
          </p>
          <button type="button" onClick={() => navigate('/products')} className="hero__cta">
            Ver catálogo completo
          </button>
        </div>
        <div className="hero__highlight" aria-hidden="true">
          <span>Novedades</span>
          <p>Ofertas exclusivas cada semana.</p>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h3>Productos destacados</h3>
          <button type="button" onClick={() => navigate('/products')} className="section__link">
            Ver todos
          </button>
        </div>
        <ProductList
          products={featuredProducts}
          onAddToCart={handleAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      </section>
    </div>
  )
}

export default HomePage
