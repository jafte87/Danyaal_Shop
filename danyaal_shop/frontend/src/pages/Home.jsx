import Navbar from "../components/Navbar"
import Banner from '../components/Banner'
import BestSellers from '../components/BestSellers'
import BrandSection from '../components/BrandSection'
import BenefitsBanner from "../components/BenefitsBanner"
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'

function Home() {
    const [bestSellers, setBestSellers] = useState([])
    const [newArrivals, setNewArrivals] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [testimonials, setTestimonials] = useState([])

    useEffect(() => {
        // Best Sellers
        fetch('http://127.0.0.1:8000/api/products/?is_best_seller=true')
            .then(res => res.json())
            .then(data => setBestSellers(data.results || data))
            .catch(err => console.error(err))

        // New Arrivals
        fetch('http://127.0.0.1:8000/api/products/?is_new_arrival=true')
            .then(res => res.json())
            .then(data => setNewArrivals(data.results || data))
            .catch(err => console.error(err))

        // Featured Products
        fetch('http://127.0.0.1:8000/api/products/?is_featured=true')
            .then(res => res.json())
            .then(data => {
                setFeaturedProducts(data.results || data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })

            fetch('http://127.0.0.1:8000/api/testimonials/')
            .then(res => res.json())
            .then(data => setTestimonials(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div>
            <Navbar />
            <Banner />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <BestSellers products={bestSellers} />
                    <BrandSection
                    title="New Arrivals"
                    products={newArrivals}
                    seeAllLink="/shop?is_new_arrival=true"
                    />

                    <BrandSection
                    title="Featured Products"
                    products={featuredProducts}
                    seeAllLink="/shop?is_featured=true"
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