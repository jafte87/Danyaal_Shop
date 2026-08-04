import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../hooks/useWishlist'
import { authFetch } from '../services/api'
import { LuPackage, LuHeart, LuUser, LuLogOut } from 'react-icons/lu'
import './AccountContent.css'
import { API_BASE_URL } from '../config'

const BASE_URL = `${API_BASE_URL}/api`

function AccountContent() {
    const { user, logout, token, login } = useAuth()
    const { addToCart } = useCart()
    const { toggleWishlist, wishlistIds } = useWishlist()
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders')
    const [wishlist, setWishlist] = useState([])

    // Profile state
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        address: user?.address || '',
    })
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileMsg, setProfileMsg] = useState(null) // { type: 'success'|'error', text }

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
        try {
            const res = await fetch(`${BASE_URL}/auth/delete/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) logout()
        } catch (err) {
            console.error(err)
        }
    }

    // Load fresh profile data from server on mount
    useEffect(() => {
        if (!token) return
        authFetch(`${BASE_URL}/auth/profile/`)
            .then(res => res.json())
            .then(data => {
                setProfileData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone_number: data.phone_number || '',
                    address: data.address || '',
                })
            })
            .catch(err => console.error(err))
    }, [token])

    useEffect(() => {
        if (!token) return
        authFetch(`${BASE_URL}/wishlist/`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setWishlist(data) })
            .catch(err => console.error(err))
    }, [token, wishlistIds])

    useEffect(() => {
        if (!token) return
        authFetch(`${BASE_URL}/orders/`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data)
                else if (data.results) setOrders(data.results)
                setOrdersLoading(false)
            })
            .catch(err => {
                console.error(err)
                setOrdersLoading(false)
            })
    }, [token])

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setProfileSaving(true)
        setProfileMsg(null)
        try {
            const res = await authFetch(`${BASE_URL}/auth/profile/`, {
                method: 'PATCH',
                body: JSON.stringify(profileData),
            })
            const data = await res.json()
            if (res.ok) {
                const refresh = localStorage.getItem('refresh_token')
                login(data, token, refresh)
                setProfileMsg({ type: 'success', text: '✓ Profile saved successfully!' })
            } else {
                const errMsg = Object.values(data).flat().join(' ')
                setProfileMsg({ type: 'error', text: errMsg || 'Failed to save profile.' })
            }
        } catch (err) {
            setProfileMsg({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setProfileSaving(false)
            setTimeout(() => setProfileMsg(null), 4000)
        }
    }

    return (
        <div className="account-container">
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
                    <button className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <LuPackage /> Orders
                    </button>
                    <button className={`account-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
                        <LuHeart /> Wishlist
                    </button>
                    <button className={`account-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <LuUser /> Profile
                    </button>
                    <button className="account-nav-btn logout" onClick={logout}>
                        <LuLogOut /> Logout
                    </button>
                </nav>
            </aside>

            <div className="account-content">
                {/* ORDERS */}
                {activeTab === 'orders' && (
                    <div className="account-section">
                        <h2 className="account-section-title">My Orders</h2>
                        {ordersLoading ? (
                            <p>Loading...</p>
                        ) : orders.length === 0 ? (
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
                                            <p className="order-date">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
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
                                                <p className="order-item-name">{item.product?.brand} {item.product?.model}</p>
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
                                            <p className="wishlist-name">{item.product?.brand} {item.product?.model}</p>
                                            <p className="wishlist-specs">{item.product?.storage} · {item.product?.colour}</p>
                                            <p className="wishlist-price">£{item.product?.price}</p>
                                        </div>
                                        <div className="wishlist-actions">
                                            <button className="wishlist-add-cart" onClick={() => addToCart(item.product)}>Add to Cart</button>
                                            <button className="wishlist-remove" onClick={() => toggleWishlist(item.product.id, navigate)}>Remove</button>
                                            <Link to={`/product/${item.product?.slug}`} className="wishlist-view">View</Link>
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
                        {profileMsg && (
                            <div className={`profile-msg ${profileMsg.type}`}>
                                {profileMsg.text}
                            </div>
                        )}
                        <form className="profile-form" onSubmit={handleProfileSubmit}>
                            <div className="profile-grid">
                                <div className="profile-field">
                                    <label>First Name</label>
                                    <input type="text" value={profileData.first_name} onChange={e => setProfileData(p => ({ ...p, first_name: e.target.value }))} />
                                </div>
                                <div className="profile-field">
                                    <label>Last Name</label>
                                    <input type="text" value={profileData.last_name} onChange={e => setProfileData(p => ({ ...p, last_name: e.target.value }))} />
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <input type="email" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} />
                                </div>
                                <div className="profile-field">
                                    <label>Phone Number</label>
                                    <input type="tel" value={profileData.phone_number} onChange={e => setProfileData(p => ({ ...p, phone_number: e.target.value }))} />
                                </div>
                                <div className="profile-field profile-field-full">
                                    <label>Address</label>
                                    <textarea rows={3} value={profileData.address} onChange={e => setProfileData(p => ({ ...p, address: e.target.value }))} />
                                </div>
                            </div>
                            <div className="profile-buttons">
                                <button type="submit" className="profile-save" disabled={profileSaving}>
                                    {profileSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="profile-delete" onClick={handleDeleteAccount}>
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccountContent