import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import '../components/OrderSuccess.css'
import { API_BASE_URL } from '../config'

function OrderSuccess() {
    const { clearCart } = useCart()

    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get('session_id')
        if (sessionId) {
            const token = localStorage.getItem('access_token')
            const headers = { 'Content-Type': 'application/json' }
            if (token) headers['Authorization'] = `Bearer ${token}`

            fetch(${API_BASE_URL}/api/orders/create-from-session/', {
                method: 'POST',
                headers,
                body: JSON.stringify({ session_id: sessionId })
            })
            .then(res => res.json())
            .then(data => console.log('Order creation response:', data))
            .catch(err => console.error('Order creation error:', err))
        }
        clearCart()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="success-container">
                <div className="success-box">
                    <div className="success-icon">✓</div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. You'll receive a confirmation email shortly.</p>
                    <Link to="/shop" className="success-btn">Continue Shopping</Link>
                    <Link to="/account" className="success-orders">View My Orders</Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default OrderSuccess