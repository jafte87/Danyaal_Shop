import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) return prev // phones are unique, can't add same twice
      return [...prev, product]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => setCartItems([])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)