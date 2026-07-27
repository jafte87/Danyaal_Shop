import { Link } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import './ShopCard.css'

function ShopCard({ product }) {
    const navigate = useNavigate()
    const { toggleWishlist, isInWishlist } = useWishlist()
    return (
        <Link to={`/product/${product.slug}`} className="shop-card">
            <div className="shop-card-image">
                <img
                    src={product.images?.length > 0 && product.images[0].image 
                    ? product.images[0].image 
                    : null}
                    alt={`${product.brand} ${product.model}`}
                />
                <button
                    className="bs-wishlist"
                    onClick={(e) => {
                    e.preventDefault()
                    toggleWishlist(product.id, navigate)
                    }}
                    >
                    <LuHeart style={{ 
                    fill: isInWishlist(product.id) ? 'var(--blue)' : 'none',
                    color: isInWishlist(product.id) ? 'var(--blue)' : 'currentColor'
                    }} />
                </button>
            </div>
            <div className="shop-card-info">
                <p className="shop-card-name">{product.brand} {product.model}</p>
                <div className="shop-card-bottom">
                    <span
                        className="shop-card-dot"
                        style={{ backgroundColor: product.colour }}
                    />
                    <span className="shop-card-price">£{product.price}</span>
                </div>
            </div>
        </Link>
    )
}

export default ShopCard