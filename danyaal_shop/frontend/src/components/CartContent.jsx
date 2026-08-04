import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { LuTrash2 } from 'react-icons/lu'
import './CartContent.css'
import { API_BASE_URL } from '../config'

function CartContent() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
    const [discountCode, setDiscountCode] = useState('')
    const [discount, setDiscount] = useState(null)
    const [discountError, setDiscountError] = useState('')
    const [shippingOption, setShippingOption] = useState(null)
    const [shippingOptions, setShippingOptions] = useState([])
    const [checkoutLoading, setCheckoutLoading] = useState(false)

    useEffect(() => {
    fetch(${API_BASE_URL}/api/shipping/')
        .then(res => res.json())
        .then(data => setShippingOptions(data))
        .catch(err => console.error(err))
    }, [])

    const handleCheckout = async () => {
        if (!shippingOption) {
            alert('Please select a shipping option')
            return
        }
        setCheckoutLoading(true)
        try {
            const res = await fetch(${API_BASE_URL}/api/checkout/create-session/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        brand: item.brand,
                        model: item.model,
                        storage: item.storage,
                        colour: item.colour,
                        condition: item.condition,
                        price: item.price,
                        quantity: item.quantity || 1,
                    })),
                    shipping_option: shippingOption,
                    discount_code: discount?.code || '',
                })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert('Something went wrong. Please try again.')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong. Please try again.')
        } finally {
            setCheckoutLoading(false)
        }
    }

    const validateDiscount = async () => {
        setDiscountError('')
        try {
            const res = await fetch(${API_BASE_URL}/api/discount/validate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode })
            })
            const data = await res.json()
            if (res.ok) {
                setDiscount(data)
            } else {
                setDiscountError(data.error)
            }
        } catch (err) {
            setDiscountError('Something went wrong')
        }
    }

    const getDiscountAmount = () => {
        if (!discount) return 0
        if (discount.discount_type === 'percentage') {
            return (totalPrice * discount.value / 100).toFixed(2)
        }
        return Math.min(discount.value, totalPrice).toFixed(2)
    }

    const shippingPrice = shippingOption?.price || 0
    const discountAmount = getDiscountAmount()
    const finalTotal = (parseFloat(totalPrice) - parseFloat(discountAmount) + parseFloat(shippingPrice)).toFixed(2)

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <p>Your cart is empty</p>
                <Link to="/shop" className="cart-empty-btn">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className="cart-container">
            {/* LEFT — ITEMS */}
            <div className="cart-items">
                <div className="cart-header">
                    <h1 className="cart-title">Your Cart</h1>
                    <button className="cart-clear" onClick={clearCart}>Clear All</button>
                </div>

                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                            <img
                                src={item.images?.length > 0 ? item.images[0].image : null}
                                alt={`${item.brand} ${item.model}`}
                            />
                        </div>
                        <div className="cart-item-info">
                            <p className="cart-item-name">{item.brand} {item.model}</p>
                            <p className="cart-item-specs">
                                {item.storage} · {item.colour} · {item.condition.replace('_', ' ')}
                            </p>
                            <p className="cart-item-condition">{item.warranty_period} Warranty</p>
                        </div>
                        <div className="cart-item-right">
                            <p className="cart-item-price">£{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                            <div className="cart-item-actions">
                                <div className="cart-qty">
                                    <button
                                        className="cart-qty-btn"
                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                    >−</button>
                                    <span className="cart-qty-value">{item.quantity || 1}</span>
                                    <button
                                        className="cart-qty-btn"
                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                    >+</button>
                                </div>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <LuTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT — SUMMARY */}
            <div className="cart-summary">
                <h2 className="cart-summary-title">Order Summary</h2>

                {/* SHIPPING */}
                <div className="cart-summary-section">
                    <p className="cart-summary-label">Shipping</p>
                    <div className="cart-shipping-options">
                        {shippingOptions.map(option => (
                            <label key={option.id} className="cart-shipping-option">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value={option.id}
                                    checked={shippingOption?.id === option.id}
                                    onChange={() => setShippingOption(option)}
                                />
                                <div className="cart-shipping-info">
                                    <span className="cart-shipping-name">{option.name}</span>
                                    <span className="cart-shipping-estimate">{option.estimate}</span>
                                </div>
                                <span className="cart-shipping-price">£{option.price}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* DISCOUNT */}
                <div className="cart-summary-section">
                    <p className="cart-summary-label">Discount Code</p>
                    <div className="cart-discount">
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={discountCode}
                            onChange={e => setDiscountCode(e.target.value)}
                        />
                        <button onClick={validateDiscount}>Apply</button>
                    </div>
                    {discountError && <p className="cart-discount-error">{discountError}</p>}
                    {discount && (
                        <p className="cart-discount-success">
                            ✓ {discount.code} applied — £{discountAmount} off
                        </p>
                    )}
                </div>

                <div className="cart-divider" />

                {/* TOTALS */}
                <div className="cart-totals">
                    <div className="cart-total-row">
                        <span>Subtotal</span>
                        <span>£{totalPrice}</span>
                    </div>
                    {discount && (
                        <div className="cart-total-row discount">
                            <span>Discount</span>
                            <span>- £{discountAmount}</span>
                        </div>
                    )}
                    <div className="cart-total-row">
                        <span>Shipping</span>
                        <span>{shippingOption ? `£${shippingOption.price}` : 'Select above'}</span>
                    </div>
                    <div className="cart-divider" />
                    <div className="cart-total-row total">
                        <span>Total</span>
                        <span>£{finalTotal}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="cart-checkout-btn"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                >
                    {checkoutLoading ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>

                <Link to="/shop" className="cart-continue">
                    ← Continue Shopping
                </Link>
            </div>
        </div>
    )
}

export default CartContent