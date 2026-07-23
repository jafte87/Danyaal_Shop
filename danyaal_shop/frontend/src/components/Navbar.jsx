import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { AiOutlineUser } from "react-icons/ai"
import { FiShoppingBag } from "react-icons/fi"
import { LuHeart } from "react-icons/lu"
import { MdMenu, MdClose } from "react-icons/md"
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const { cartItems } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)
    
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)

    const handleSearch = () => {
        if (searchQuery.trim()) {
        navigate(`/shop?search=${searchQuery}`)
        setSearchQuery('')
            }
        }

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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <IoSearchOutline
                className="search-icon" 
                onClick={handleSearch}
            />
        </div>

        <div className="icons-btns">
            <Link to="/sell-your-phone">
                <button>Sell your device</button>
            </Link>

            <Link to="/account">
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

            <Link to="/wishlist">
                <LuHeart />
            </Link>

            {/* Mobile search icon */}
            <IoSearchOutline 
                className="mobile-search-icon"
                onClick={() => setSearchOpen(!searchOpen)}
            />

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <MdClose /> : <MdMenu />}
            </div>
        </div>
    </div>

    {/* MOBILE SEARCH BAR — full width when open */}
    {searchOpen && (
        <div className="mobile-search-bar">
            <input
                type="search"
                placeholder="Search for phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch()
                        setSearchOpen(false)
                    }
                }}
                autoFocus
            />
            <IoSearchOutline onClick={() => {
                handleSearch()
                setSearchOpen(false)
            }} />
        </div>
    )}

    {/* BOTTOM NAV - desktop */}
    <div className="nav-bottom">
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
        </ul>
    </div>

    {/* MOBILE MENU */}
    <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link></li>
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