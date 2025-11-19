import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ProductContext = createContext()
const API_URL = 'https://66f2f59771c84d8058791634.mockapi.io/api/v1/products'

const FALLBACK_PRODUCTS = [
  {
    id: '101',
    title: 'Audífonos inalámbricos Noise Canceller',
    price: 2499,
    description:
      'Disfruta de una experiencia de sonido envolvente con cancelación activa de ruido y hasta 24 horas de batería.',
    category: 'audio',
    image:
      'https://images.unsplash.com/photo-1518444028784-87283d1c93ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '102',
    title: 'Smartwatch deportivo Pro Fit',
    price: 3199,
    description:
      'Monitoriza tu actividad diaria, tu frecuencia cardiaca y recibe notificaciones inteligentes en tu muñeca.',
    category: 'wearables',
    image:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '103',
    title: 'Laptop ultraligera 14"',
    price: 18999,
    description:
      'Potencia y portabilidad con 16 GB de RAM, 512 GB SSD y pantalla Full HD antirreflejo.',
    category: 'computadoras',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '104',
    title: 'Mouse ergonómico inalámbrico',
    price: 799,
    description:
      'Diseño ergonómico para sesiones largas de trabajo con conectividad Bluetooth y sensor de alta precisión.',
    category: 'accesorios',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '105',
    title: 'Cámara mirrorless 4K',
    price: 22999,
    description:
      'Captura imágenes y video en 4K con estabilización óptica y lente intercambiable 18-55 mm.',
    category: 'fotografía',
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '106',
    title: 'Bocina inteligente con asistente de voz',
    price: 1599,
    description:
      'Controla tu hogar inteligente, escucha música en alta fidelidad y recibe noticias con comandos de voz.',
    category: 'hogar inteligente',
    image:
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
  },
]

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

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
      setError('Problemas de conexión con MockAPI. Mostramos datos locales.')
      setProducts((prev) => (prev.length > 0 ? prev : FALLBACK_PRODUCTS))
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
