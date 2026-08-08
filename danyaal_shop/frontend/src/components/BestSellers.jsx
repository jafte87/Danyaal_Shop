import { Link } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import './BestSellers.css'

function BestSellers({ products, backgroundImage }) {
    const scrollRef = useRef(null)
    const navigate = useNavigate()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const scroll = (direction) => {
    if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    } else {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
}
    

    return (
    <section className="best-sellers">
        <div 
            className="bs-banner" 
            style={backgroundImage ? { 
                '--bg-desktop': backgroundImage.desktop ? `url(${backgroundImage.desktop})` : 'none', 
                '--bg-mobile': backgroundImage.mobile ? `url(${backgroundImage.mobile})` : (backgroundImage.desktop ? `url(${backgroundImage.desktop})` : 'none'),
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundImage: 'var(--bg-desktop)'
            } : {}}
        >
            <div className="bs-content">
                {/* TOP ROW — title and see all */}
                <div className="bs-top-row">
                    <h2 className="bs-title">Best Sellers</h2>
                    <Link to="/shop?is_best_seller=true" className="bs-see-all">
                        See All
                    </Link>
                </div>

                {/* SCROLL AREA WITH SIDE BUTTONS */}
                <div className="bs-scroll-container">
                    <button className="bs-scroll-btn bs-scroll-left" onClick={() => scroll('left')}>
                        <MdChevronLeft />
                    </button>

                    <div className="bs-scroll-wrapper" ref={scrollRef}>
                        <div className="bs-cards">
                            {products?.slice(0, 10).map(product => (
                                <Link
                                    to={`/product/${product.slug}`}
                                    key={product.id}
                                    className="bs-card"
                                >
                                    <div className="bs-card-image">
                                        <img
                                            src={
                                                product.images?.length > 0
                                                ? product.images[0].image
                                                : null
                                            }
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
                                    <div className="bs-card-info">
                                        <p className="bs-card-name">{product.brand} {product.model}</p>
                                        <div className="bs-card-bottom">
                                            <span
                                                className="bs-colour-dot"
                                                style={{ backgroundColor: product.colour }}
                                            />
                                            <span className="bs-price">£{product.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button className="bs-scroll-btn bs-scroll-right" onClick={() => scroll('right')}>
                        <MdChevronRight />
                    </button>
                </div>
            </div>
        </div>
    </section>
)
}

export default BestSellers