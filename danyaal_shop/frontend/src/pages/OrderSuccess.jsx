import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import '../components/OrderSuccess.css'

function OrderSuccess() {
    const { clearCart } = useCart()

    useEffect(() => {
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