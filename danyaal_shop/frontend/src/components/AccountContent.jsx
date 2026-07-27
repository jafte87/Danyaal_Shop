import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../hooks/useWishlist'
import { LuPackage, LuHeart, LuUser, LuLogOut } from 'react-icons/lu'
import './AccountContent.css'

function AccountContent() {
    const { user, logout, token } = useAuth()
    const { addToCart } = useCart()
    const [activeTab, setActiveTab] = useState('orders')
    const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    
    try {
        const res = await fetch('http://127.0.0.1:8000/api/auth/delete/', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            logout()
        }
        } catch (err) {
        console.error(err)
        }
    }

    // placeholder data until API connected
    const orders = []
    const { toggleWishlist, wishlistIds } = useWishlist()
    const [wishlist, setWishlist] = useState([])

    useEffect(() => {
        if (!token) return
        fetch('http://127.0.0.1:8000/api/wishlist/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setWishlist(data))
            .catch(err => console.error(err))
        }, [token, wishlistIds])

    return (
        <div className="account-container">
            {/* SIDEBAR */}
            <aside className="account-sidebar">
                <div className="account-user">
                    <div className="account-avatar">
                        {user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="account-name">{user?.first_name} {user?.last_name}</p>
                        <p className="account-email">{user?.email}</p>
                    </div>
                </div>

                <nav className="account-nav">
                    <button
                        className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <LuPackage /> Orders
                    </button>
                    <button
                        className={`account-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        <LuHeart /> Wishlist
                    </button>
                    <button
                        className={`account-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <LuUser /> Profile
                    </button>
                    <button
                        className="account-nav-btn logout"
                        onClick={logout}
                    >
                        <LuLogOut /> Logout
                    </button>
                </nav>
            </aside>

            {/* CONTENT */}
            <div className="account-content">

                {/* ORDERS */}
                {activeTab === 'orders' && (
                    <div className="account-section">
                        <h2 className="account-section-title">My Orders</h2>
                        {orders.length === 0 ? (
                            <div className="account-empty">
                                <p>No orders yet</p>
                                <Link to="/shop" className="account-empty-btn">Start Shopping</Link>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <p className="order-id">Order #{order.id}</p>
                                            <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="order-right">
                                            <span className={`order-status ${order.status}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <p className="order-total">£{order.total_price}</p>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="order-item">
                                                <p className="order-item-name">
                                                    {item.product?.brand} {item.product?.model}
                                                </p>
                                                <p className="order-item-price">£{item.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* WISHLIST */}
                {activeTab === 'wishlist' && (
                    <div className="account-section">
                        <h2 className="account-section-title">My Wishlist</h2>
                        {wishlist.length === 0 ? (
                            <div className="account-empty">
                                <p>Your wishlist is empty</p>
                                <Link to="/shop" className="account-empty-btn">Browse Phones</Link>
                            </div>
                        ) : (
                            <div className="wishlist-list">
                                {wishlist.map(item => (
                                    <div key={item.id} className="wishlist-item">
                                        <div className="wishlist-image">
                                            <img
                                                src={item.product?.images?.[0]?.image || null}
                                                alt={`${item.product?.brand} ${item.product?.model}`}
                                            />
                                        </div>
                                        <div className="wishlist-info">
                                            <p className="wishlist-name">
                                                {item.product?.brand} {item.product?.model}
                                            </p>
                                            <p className="wishlist-specs">
                                                {item.product?.storage} · {item.product?.colour}
                                            </p>
                                            <p className="wishlist-price">£{item.product?.price}</p>
                                        </div>
                                        <div className="wishlist-actions">
                                            <button
                                                className="wishlist-add-cart"
                                                onClick={() => addToCart(item.product)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="wishlist-remove"
                                                onClick={() => toggleWishlist(item.product.id, navigate)}
                                            >
                                                Remove
                                            </button>
                                            <Link
                                                to={`/product/${item.product?.slug}`}
                                                className="wishlist-view"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PROFILE */}
                {activeTab === 'profile' && (
                    <div className="account-section">
                        <h2 className="account-section-title">My Profile</h2>
                        <form className="profile-form">
                            <div className="profile-grid">
                                <div className="profile-field">
                                    <label>First Name</label>
                                    <input type="text" defaultValue={user?.first_name} />
                                </div>
                                <div className="profile-field">
                                    <label>Last Name</label>
                                    <input type="text" defaultValue={user?.last_name} />
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <input type="email" defaultValue={user?.email} />
                                </div>
                                <div className="profile-field">
                                    <label>Phone Number</label>
                                    <input type="tel" defaultValue={user?.phone_number} />
                                </div>
                                <div className="profile-field profile-field-full">
                                    <label>Address</label>
                                    <textarea rows={3} defaultValue={user?.address} />
                                </div>
                            </div>
                            <button type="submit" className="profile-save">Save Changes</button>
                            <button 
                                type="button" 
                                className="profile-delete"
                                onClick={handleDeleteAccount}
                            >
                            Delete Account
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccountContent