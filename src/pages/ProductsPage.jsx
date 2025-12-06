import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import ProductList from '../components/ProductList.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'

function ProductsPage({ navigate }) {
  const {
    paginatedProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    totalPages,
    currentPage,
    setCurrentPage,
    categories,
  } = useProducts()
  const { addItem } = useCart()

  const handleAddToCart = (product) => {
    addItem(product)
    toast.success(`${product.title} se agregó a tu carrito`)
  }

  return (
    <div className="page">
      <Helmet>
        <title>Catálogo | Tech Market</title>
        <meta name="description" content="Explora el catálogo completo, filtra por categoría y encuentra el producto ideal." />
      </Helmet>
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Catálogo actualizado</p>
            <h2>Productos disponibles</h2>
            <p>Selecciona tus artículos favoritos y agrégalos a tu carrito.</p>
          </div>
        </div>
        <div className="row g-3 align-items-end filters">
          <div className="col-12 col-md-6">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="col-12 col-md-4">
            <label className="filters__select">
              Categoría
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas' : category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <ProductList
          products={paginatedProducts}
          onAddToCart={handleAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </section>
    </div>
  )
}

export default ProductsPage
