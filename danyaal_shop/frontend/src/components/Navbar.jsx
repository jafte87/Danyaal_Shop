import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { AiOutlineUser } from "react-icons/ai"
import { FiShoppingBag } from "react-icons/fi"
import { LuHeart } from "react-icons/lu"
import { MdMenu, MdClose } from "react-icons/md"
import { IoSearchOutline } from "react-icons/io5"
import './Navbar.css'
import { API_BASE_URL } from '../config'

function Navbar() {
    const { cartItems } = useCart()
    const { isAuthenticated } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([])
            setDropdownOpen(false)
            return
        }
        const timeout = setTimeout(() => {
            fetch(`http://127.0.0.1:8000/api/products/?search=${searchQuery}`)
                .then(res => res.json())
                .then(data => {
                    const results = data.results || data
                    setSearchResults(results.slice(0, 5))
                    setDropdownOpen(true)
                })
                .catch(err => console.error(err))
        }, 300)
        return () => clearTimeout(timeout)
    }, [searchQuery])

    return (
        <nav className="nav">
            <div className="nav-top">
                <div className="logo">
                    <img src="" alt="Logo" />
                </div>

                {/* SEARCH BAR - desktop */}
                <div className="list-search-bar desktop-search">
                    <input
                        type="search"
                        placeholder="Search for phones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                        onFocus={() => searchResults.length > 0 && setDropdownOpen(true)}
                    />
                    <IoSearchOutline className="search-icon" />

                    {/* DROPDOWN */}
                    {dropdownOpen && searchQuery.trim().length >= 2 && (
                        <div className="search-dropdown">
                            {searchResults.length > 0 ? (
                                <>
                                    {searchResults.map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.slug}`}
                                            className="search-result"
                                            onClick={() => {
                                                setDropdownOpen(false)
                                                setSearchQuery('')
                                                setSearchResults([])
                                            }}
                                        >
                                            <div className="search-result-image">
                                                <img
                                                    src={product.images?.length > 0 ? product.images[0].image : null}
                                                    alt={`${product.brand} ${product.model}`}
                                                />
                                            </div>
                                            <div className="search-result-info">
                                                <p className="search-result-name">{product.brand} {product.model}</p>
                                                <p className="search-result-specs">{product.storage} · {product.colour}</p>
                                            </div>
                                            <p className="search-result-price">£{product.price}</p>
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                <div className="search-no-results">
                                    <p>No products found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="icons-btns">
                    <Link to="/sell-your-phone">
                        <button>Sell your device</button>
                    </Link>

                    <Link to={isAuthenticated ? '/account' : '/login'}>
                        <AiOutlineUser />
                    </Link>

                    <Link to="/cart">
                        <div className="cart-icon">
                            <FiShoppingBag />
                            {cartItems.length > 0 && (
                                <span className="cart-badge">{cartItems.length}</span>
                            )}
                        </div>
                    </Link>

                    <Link to={isAuthenticated ? '/account?tab=wishlist' : '/login'}>
                         <LuHeart />
                    </Link>
                    <IoSearchOutline
                        className="mobile-search-icon"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    />

                    <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <MdClose /> : <MdMenu />}
                    </div>
                </div>
            </div>

            {/* MOBILE SEARCH BAR */}
            {mobileSearchOpen && (
                <div className="mobile-search-bar">
                    <input
                        type="search"
                        placeholder="Search for phones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <IoSearchOutline />

                    {/* MOBILE DROPDOWN */}
                    {dropdownOpen && searchQuery.trim().length >= 2 && (
                        <div className="search-dropdown mobile-dropdown">
                            {searchResults.length > 0 ? (
                                <>
                                    {searchResults.map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.slug}`}
                                            className="search-result"
                                            onClick={() => {
                                                setDropdownOpen(false)
                                                setSearchQuery('')
                                                setSearchResults([])
                                                setMobileSearchOpen(false)
                                            }}
                                        >
                                            <div className="search-result-image">
                                                <img
                                                    src={product.images?.length > 0 ? product.images[0].image : null}
                                                    alt={`${product.brand} ${product.model}`}
                                                />
                                            </div>
                                            <div className="search-result-info">
                                                <p className="search-result-name">{product.brand} {product.model}</p>
                                                <p className="search-result-specs">{product.storage} · {product.colour}</p>
                                            </div>
                                            <p className="search-result-price">£{product.price}</p>
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                <div className="search-no-results">
                                    <p>No products found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* BOTTOM NAV */}
            <div className="nav-bottom">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                </ul>
            </div>

            {/* MOBILE MENU */}
            <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
                <li><Link to="/about-us" onClick={() => setMenuOpen(false)}>About Us</Link></li>
                <li>
                    <Link
                        to="/sell-your-phone"
                        className="sell-btn"
                        onClick={() => setMenuOpen(false)}
                    >
                        Sell Your Device
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar