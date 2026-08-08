import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import './BrandSection.css'

function BrandSection({ title, products, seeAllLink, backgroundImage }) {
    const scrollRef = useRef(null)
    const navigate = useNavigate()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const scroll = (direction) => {
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        })
    }

    return (
        <section className="brand-section">
            <div 
                className="brand-banner"
                style={backgroundImage ? { 
                    backgroundImage: `url(${backgroundImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                } : {}}
            >
                {/* TOP ROW */}
                <div className="brand-top-row">
                    <h2 className="brand-title">{title}</h2>
                    <Link to={seeAllLink} className="brand-see-all">See All</Link>
                </div>

                {/* SCROLL CONTAINER */}
                <div className="brand-scroll-container">
                    <button className="brand-scroll-btn" onClick={() => scroll('left')}>
                        <MdChevronLeft />
                    </button>

                    <div className="brand-scroll-wrapper" ref={scrollRef}>
                        <div className="brand-cards">
                            {products?.slice(0, 10).map(product => (
                                <Link
                                    to={`/product/${product.slug}`}
                                    key={product.id}
                                    className="brand-card"
                                >
                                    <div className="brand-card-image">
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
                                    <div className="brand-card-info">
                                        <p className="brand-card-name">
                                            {product.brand} {product.model}
                                        </p>
                                        <div className="brand-card-bottom">
                                            <span
                                                className="brand-colour-dot"
                                                style={{ backgroundColor: product.colour }}
                                            />
                                            <span className="brand-price">£{product.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button className="brand-scroll-btn" onClick={() => scroll('right')}>
                        <MdChevronRight />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default BrandSection