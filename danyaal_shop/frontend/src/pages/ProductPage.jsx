import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import { useCart } from '../context/CartContext'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BestSellers from '../components/BestSellers'
import Testimonials from '../components/Testimonials'
import BenefitsBanner from '../components/BenefitsBanner'
import { Helmet } from 'react-helmet-async'
import './ProductPage.css'

function ProductPage() {
    const { slug } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [bestSellers, setBestSellers] = useState([])
    const [testimonials, setTestimonials] = useState([])
    const [added, setAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const nextImage = () => {
    setActiveImage(prev => (prev + 1) % product.images.length)
    }
    const [touchStart, setTouchStart] = useState(null)
    const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)}
    const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (diff > 50) nextImage()
    if (diff < -50) prevImage()
    setTouchStart(null)}

    const prevImage = () => {
    setActiveImage(prev => (prev - 1 + product.images.length) % product.images.length)
    }

    useEffect(() => {
        // fetch product
        fetch(`http://127.0.0.1:8000/api/products/${slug}/`)
            .then(res => res.json())
            .then(data => {
                setProduct(data)
                setLoading(false)
            })
            .catch(err => console.error(err))

        // fetch best sellers
        fetch('http://127.0.0.1:8000/api/products/?is_best_seller=true')
            .then(res => res.json())
            .then(data => setBestSellers(data.results || data))
            .catch(err => console.error(err))

        // fetch testimonials
        fetch('http://127.0.0.1:8000/api/testimonials/')
            .then(res => res.json())
            .then(data => setTestimonials(data))
            .catch(err => console.error(err))
    }, [slug])

    const handleAddToCart = () => {
        addToCart(product, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) return (
        <div>
            <Navbar />
            <div className="pp-loading">Loading...</div>
            <Footer />
        </div>
    )

    if (!product) return (
        <div>
            <Navbar />
            <div className="pp-loading">Product not found.</div>
            <Footer />
        </div>
    )

    return (
        <div>
            <Helmet>
                <title>
                    {product.meta_title
                        || `${product.brand} ${product.model} ${product.storage} ${product.colour} — ${product.condition} | Danyaal Shop`
                    }
                </title>
                <meta
                    name="description"
                    content={
                        product.meta_description
                        || `Buy a ${product.condition} ${product.brand} ${product.model} (${product.storage}, ${product.colour}) for £${product.price} at Danyaal Shop. ${product.network_status ? `Network: ${product.network_status}.` : ''} Comes with warranty, fast UK delivery.`
                    }
                />
            </Helmet>
            <Navbar />

            {/* PRODUCT SECTION */}
            <div className="pp-container">

                {/* LEFT — GALLERY */}
                <div className="pp-gallery">
                    {/* MAIN IMAGE */}
                    <div className="pp-main-image" 
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}>
                        {product.images?.length > 0 ? (
                            <>
                                <img 
                                src={product.images[activeImage]?.image} 
                                alt={`${product.brand} ${product.model}`} 
                                />
                                {product.images?.length > 1 && (
                            <>
                            <button className="pp-arrow pp-arrow-left" onClick={prevImage}>
                                <MdChevronLeft />
                            </button>
                            <button className="pp-arrow pp-arrow-right" onClick={nextImage}>
                                <MdChevronRight />
                            </button>
                            </>
                            )}
                            </>
                             ) : (
                            <div className="pp-no-image">No Image</div>
                            )}
                            </div>

                    {/* THUMBNAILS */}
                    {product.images?.length > 1 && (
                        <div className="pp-thumbnails">
                            {product.images.map((img, index) => (
                                <button
                                    key={img.id}
                                    className={`pp-thumb ${activeImage === index ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <img src={img.image} alt={`view ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                        )}
                    </div>

                {/* RIGHT — INFO */}
                <div className="pp-info">
                    {/* BRAND + NAME */}
                    <p className="pp-brand">{product.brand}</p>
                    <h1 className="pp-name">{product.brand} {product.model}</h1>

                    {/* PRICE */}
                    <p className="pp-price">£{product.price}</p>

                    {/* STOCK */}
                    <p className={`pp-stock ${product.in_stock ? 'in' : 'out'}`}>
                        {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                    </p>

                    <div className="pp-divider" />

                    {/* SPECS */}
                    <div className="pp-specs">
                        <div className="pp-spec">
                            <span className="pp-spec-label">Condition</span>
                            <span className="pp-spec-value pp-condition">
                                {product.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>
                        <div className="pp-spec">
                            <span className="pp-spec-label">Storage</span>
                            <span className="pp-spec-value">{product.storage}</span>
                        </div>
                        <div className="pp-spec">
                            <span className="pp-spec-label">Colour</span>
                            <div className="pp-colour">
                                <span
                                    className="pp-colour-dot"
                                    style={{ backgroundColor: product.colour }}
                                />
                                <span className="pp-spec-value">{product.colour}</span>
                            </div>
                        </div>
                        <div className="pp-spec">
                            <span className="pp-spec-label">Network</span>
                            <span className="pp-spec-value">
                                {product.network_status.charAt(0).toUpperCase() + product.network_status.slice(1)}
                            </span>
                        </div>
                        {product.battery_health && (
                            <div className="pp-spec">
                                <span className="pp-spec-label">Battery Health</span>
                                <span className="pp-spec-value">{product.battery_health}%</span>
                            </div>
                        )}
                        <div className="pp-spec">
                            <span className="pp-spec-label">Warranty</span>
                            <span className="pp-spec-value">{product.warranty_period}</span>
                        </div>
                        <div className="pp-spec">
                            <span className="pp-spec-label">Delivery</span>
                            <span className="pp-spec-value">{product.delivery_estimate}</span>
                        </div>
                        {product.accessories && (
                            <div className="pp-spec">
                                <span className="pp-spec-label">Includes</span>
                                <span className="pp-spec-value">{product.accessories}</span>
                            </div>
                        )}
                    </div>

                    <div className="pp-divider" />

                    {/* DESCRIPTION */}
                    <div className="pp-description">
                        <p className="pp-desc-title">Description</p>
                        <p className="pp-desc-text">{product.description}</p>
                    </div>

                    <div className="pp-divider" />

                    {/* ACTIONS */}
                    <div className="pp-actions">
                        {/* QUANTITY STEPPER */}
                        <div className="pp-quantity">
                            <button
                                className="pp-qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                type="button"
                            >−</button>
                            <span className="pp-qty-value">{quantity}</span>
                            <button
                                className="pp-qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                                type="button"
                            >+</button>
                        </div>
                        <button
                            className={`pp-add-cart ${added ? 'added' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!product.in_stock}
                        >
                            {added ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
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
                </div>
            </div>

            {/* BENEFITS BANNER */}
            <BenefitsBanner />

            {/* TESTIMONIALS */}
            <Testimonials testimonials={testimonials} />

            {/* BEST SELLERS */}
            <BestSellers products={bestSellers} />

            <Footer />
        </div>
    )
}

export default ProductPage