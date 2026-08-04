import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('cart')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    const saveCart = (items) => {
        setCartItems(items)
        localStorage.setItem('cart', JSON.stringify(items))
    }

    // Add product — if already in cart, increase qty instead of blocking
    const addToCart = (product, qty = 1) => {
        const existing = cartItems.find(item => item.id === product.id)
        if (existing) {
            saveCart(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: (item.quantity || 1) + qty }
                    : item
            ))
        } else {
            saveCart([...cartItems, { ...product, quantity: qty }])
        }
    }

    // Set exact quantity for a cart item (min 1)
    const updateQuantity = (productId, qty) => {
        if (qty < 1) return
        saveCart(cartItems.map(item =>
            item.id === productId ? { ...item, quantity: qty } : item
        ))
    }

    const removeFromCart = (productId) => {
        saveCart(cartItems.filter(item => item.id !== productId))
    }

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem('cart')
    }

    // Total respects quantity
    const totalPrice = cartItems
        .reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0)
        .toFixed(2)

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)