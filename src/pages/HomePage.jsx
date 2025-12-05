import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import ProductList from '../components/ProductList.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'

function HomePage({ navigate }) {
  const { products, loading, error } = useProducts()
  const { addItem } = useCart()
  const featuredProducts = products.slice(0, 4)

  // Seleccionar producto aleatorio (solo se recalcula cuando cambia products)
  const randomProduct = useMemo(() => {
    if (products.length === 0) return null
    const randomIndex = Math.floor(Math.random() * products.length)
    return products[randomIndex]
  }, [products])

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
          {randomProduct ? (
            <>
              <p>{randomProduct.title}</p>
              <img 
                src={randomProduct.image} 
                alt={randomProduct.title}
                loading="lazy"
                onClick={() => navigate(`/products/${randomProduct.id}`)}
                className="hero__highlight-image"
              />
            </>
          ) : (
            <>
              <p>Ofertas exclusivas cada semana.</p>
              <img src="/images/hero.png" alt="Hero banner" loading="lazy" />
            </>
          )}
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