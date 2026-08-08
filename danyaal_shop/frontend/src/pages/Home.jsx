import Navbar from "../components/Navbar"
import Banner from '../components/Banner'
import BestSellers from '../components/BestSellers'
import BrandSection from '../components/BrandSection'
import BenefitsBanner from "../components/BenefitsBanner"
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { API_BASE_URL } from '../config'

function Home() {
    const [bestSellers, setBestSellers] = useState([])
    const [newArrivals, setNewArrivals] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [testimonials, setTestimonials] = useState([])

    const [sectionBgs, setSectionBgs] = useState({})

    useEffect(() => {
        // Fetch Section Backgrounds
        fetch(`${API_BASE_URL}/api/section-backgrounds/`)
            .then(res => res.json())
            .then(data => setSectionBgs(data))
            .catch(err => console.error(err))

        // Best Sellers
        fetch(`${API_BASE_URL}/api/products/?is_best_seller=true`)
            .then(res => res.json())
            .then(data => setBestSellers(data.results || data))
            .catch(err => console.error(err))

        // New Arrivals
        fetch(`${API_BASE_URL}/api/products/?is_new_arrival=true`)
            .then(res => res.json())
            .then(data => setNewArrivals(data.results || data))
            .catch(err => console.error(err))

        // Featured Products
        fetch(`${API_BASE_URL}/api/products/?is_featured=true`)
            .then(res => res.json())
            .then(data => {
                setFeaturedProducts(data.results || data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })

        fetch(`${API_BASE_URL}/api/testimonials/`)
            .then(res => res.json())
            .then(data => setTestimonials(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div>
            <Helmet>
                <title>Danyaal Shop | Buy &amp; Sell Premium Used Phones in the UK</title>
                <meta name="description" content="Shop the best quality used iPhones, Samsung, Google Pixel and more at Danyaal Shop. Fully tested, warrantied, and delivered fast across the UK." />
            </Helmet>
            <Navbar />
            <Banner />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <BestSellers products={bestSellers} backgroundImage={sectionBgs.best_sellers} />
                    <BrandSection
                        title="New Arrivals"
                        products={newArrivals}
                        seeAllLink="/shop?is_new_arrival=true"
                        backgroundImage={sectionBgs.new_arrivals}
                    />

                    <BrandSection
                        title="Featured Products"
                        products={featuredProducts}
                        seeAllLink="/shop?is_featured=true"
                        backgroundImage={sectionBgs.featured_products}
                    />
                </>
            )}
            <BenefitsBanner />
            <Testimonials testimonials={testimonials} />
            <Footer />
        </div>
    )
}

export default Home