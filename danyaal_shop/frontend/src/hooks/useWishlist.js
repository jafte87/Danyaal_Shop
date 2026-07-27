import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useWishlist = () => {
    const { isAuthenticated, token } = useAuth()
    const [wishlistIds, setWishlistIds] = useState([])

    // fetch wishlist IDs on mount if logged in
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setWishlistIds([])
            return
        }
        fetch('http://127.0.0.1:8000/api/wishlist/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                const ids = data.map(item => item.product.id)
                setWishlistIds(ids)
                }
            })
            .catch(err => console.error(err))
        }, [isAuthenticated, token])

    const toggleWishlist = async (productId, navigate) => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${productId}/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.status === 'added') {
                setWishlistIds(prev => [...prev, productId])
            } else {
                setWishlistIds(prev => prev.filter(id => id !== productId))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const isInWishlist = (productId) => wishlistIds.includes(productId)

    return { toggleWishlist, isInWishlist, wishlistIds }
}