import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ProductContext = createContext()
const API_URL = 'https://6929cd4d9d311cddf34b4f3f.mockapi.io/api/v1/products'

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('No fue posible obtener los productos desde MockAPI.')
      }

      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (requestError) {
      console.error('Error al obtener productos:', requestError)
      setError('No fue posible cargar los productos. Inténtalo nuevamente en unos instantes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = useCallback(async (payload) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('No fue posible crear el producto en MockAPI.')
    }

    const created = await response.json()
    setProducts((prev) => [...prev, created])
    return created
  }, [])

  const updateProduct = useCallback(async (productId, payload) => {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('No fue posible actualizar el producto en MockAPI.')
    }

    const updated = await response.json()
    setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    return updated
  }, [])

  const deleteProduct = useCallback(async (productId) => {
    const response = await fetch(`${API_URL}/${productId}`, { method: 'DELETE' })

    if (!response.ok) {
      throw new Error('No fue posible eliminar el producto en MockAPI.')
    }

    try {
      await response.json()
    } catch (error) {
      // Algunos endpoints no regresan contenido al eliminar.
    }
    setProducts((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    return products
      .filter((product) => {
        if (!normalizedTerm) {
          return true
        }

        return (
          product.title?.toLowerCase().includes(normalizedTerm) ||
          product.category?.toLowerCase().includes(normalizedTerm)
        )
      })
      .filter((product) => {
        if (categoryFilter === 'all') {
          return true
        }

        return product.category === categoryFilter
      })
  }, [products, searchTerm, categoryFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const categories = useMemo(() => {
    const setOfCategories = new Set(products.map((product) => product.category).filter(Boolean))
    return ['all', ...Array.from(setOfCategories)]
  }, [products])

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      searchTerm,
      setSearchTerm,
      categoryFilter,
      setCategoryFilter,
      paginatedProducts,
      filteredProducts,
      totalPages,
      currentPage,
      setCurrentPage,
      pageSize,
      categories,
    }),
    [
      products,
      loading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      searchTerm,
      categoryFilter,
      paginatedProducts,
      filteredProducts,
      totalPages,
      currentPage,
      categories,
      pageSize,
    ],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductProvider')
  }

  return context
}
