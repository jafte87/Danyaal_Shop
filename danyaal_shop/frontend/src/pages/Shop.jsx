import { useState, useEffect } from 'react'
import { LuFilter } from "react-icons/lu"
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import Filters from '../components/Filters'
import ShopCard from '../components/ShopCard'
import { Helmet } from 'react-helmet-async'
import '../components/Shop.css'
import { API_BASE_URL } from '../config'

function Shop() {
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState(() => {
        const searchFromUrl = searchParams.get('search')
        return searchFromUrl ? { search: searchFromUrl } : {}
    })
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const PAGE_SIZE = 12

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters.brand) params.append('brand', filters.brand)
        if (filters.condition) params.append('condition', filters.condition)
        if (filters.storage) params.append('storage', filters.storage)
        if (filters.colour) params.append('colour', filters.colour)
        if (filters.min_price) params.append('min_price', filters.min_price)
        if (filters.max_price) params.append('max_price', filters.max_price)
        if (filters.search) params.append('search', filters.search)
        params.append('page', page)
        params.append('page_size', PAGE_SIZE)

        fetch(`http://127.0.0.1:8000/api/products/?${params.toString()}`)
            .then(res => {
                if (!res.ok) {
                    setHasMore(false)
                    setLoading(false)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (!data) return
                if (page === 1) {
                    setProducts(data.results || [])
                } else {
                    setProducts(prev => [...prev, ...(data.results || [])])
                }
                setHasMore(data.next !== null)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [filters, page])

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
        setPage(1)
        setProducts([])
        setLoading(true)
    }

    return (
        <div>
            <Helmet>
                <title>
                    {filters.brand
                        ? `Buy Used ${filters.brand} Phones | Danyaal Shop`
                        : 'Shop Used Phones | iPhone, Samsung & More — Danyaal Shop'
                    }
                </title>
                <meta
                    name="description"
                    content={
                        filters.brand
                            ? `Browse our range of quality used ${filters.brand} phones. Tested, warrantied and ready to ship across the UK.`
                            : 'Browse our full range of used iPhones, Samsung, Google Pixel and more. Filter by brand, model, storage and condition. UK delivery.'
                    }
                />
            </Helmet>
            <Navbar />
            <Banner page="shop" />

            <div className="shop-container">
                <Filters
                    filters={filters}
                    onChange={handleFilterChange}
                    isOpen={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                />
                <div className="shop-main">
                    <div className="shop-toolbar">
                        <button
                            className="shop-filter-btn"
                            onClick={() => setFiltersOpen(true)}
                        >
                            <LuFilter />
                        </button>
                        <p className="shop-count">{products.length} products</p>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : products.length === 0 ? (
                        <div className="shop-no-results">
                            <p>No products found</p>
                            <p>Try different keywords or filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="shop-grid">
                                {products.filter(p => p && p.slug).map(product => (
                                    <ShopCard key={product.id} product={product} />
                                ))}
                            </div>
                            {hasMore && (
                                <div className="shop-load-more">
                                    <button onClick={() => setPage(prev => prev + 1)}>
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Shop