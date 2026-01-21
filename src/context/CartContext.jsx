import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext()
const CART_STORAGE_KEY = 'tech_market_cart'

function readStoredCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('No fue posible leer el carrito persistido:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (storageError) {
      console.error('No fue posible persistir el carrito:', storageError)
    }
  }, [items])

  const addItem = useCallback((product) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id)

      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...prevItems,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prevItems) => {
      if (Number.isNaN(quantity) || quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId)
      }

      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.floor(quantity) } : item,
      )
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const cartCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items])
  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity * (Number(item.price) || 0), 0),
    [items],
  )

  const value = useMemo(
    () => ({
      cartItems: items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      totalPrice,
    }),
    [items, cartCount, totalPrice, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }

  return context
}
