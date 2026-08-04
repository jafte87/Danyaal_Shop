import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authFetch } from '../services/api'

export const useWishlist = () => {
    const { isAuthenticated } = useAuth()
    const [wishlistIds, setWishlistIds] = useState([])

    useEffect(() => {
        if (!isAuthenticated) {
            setWishlistIds([])
            return
        }
        authFetch('http://127.0.0.1:8000/api/wishlist/')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const ids = data.map(item => item.product.id)
                    setWishlistIds(ids)
                }
            })
            .catch(err => console.error(err))
    }, [isAuthenticated])

    const toggleWishlist = async (productId, navigate) => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        try {
            const res = await authFetch(`http://127.0.0.1:8000/api/wishlist/${productId}/`, {
                method: 'POST',
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