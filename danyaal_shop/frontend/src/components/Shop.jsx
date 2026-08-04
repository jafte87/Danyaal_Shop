import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Filters from '../components/Filters'
import Banner from '../components/Banner'
import './Shop.css'
import { API_BASE_URL } from '../config'

function Shop() {
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState({})
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [searchParams] = useSearchParams()
    const PAGE_SIZE = 12


    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.brand) params.append('brand', filters.brand)
        if (filters.condition) params.append('condition', filters.condition)
        if (filters.storage) params.append('storage', filters.storage)
        if (filters.colour) params.append('colour', filters.colour)
        if (filters.min_price) params.append('min_price', filters.min_price)
        if (filters.max_price) params.append('max_price', filters.max_price)

        fetch(`http://127.0.0.1:8000/api/products/?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (page === 1) {
                setProducts(data.results)
            } else {
                setProducts(prev => [...prev, ...data.results])
            }
            setHasMore(data.next !== null)
            setLoading(false)
            })
            .catch(err => console.error(err))
    }, [filters, page])

    useEffect(() => {
        const searchFromUrl = searchParams.get('search')
        if (searchFromUrl) {
            setFilters(prev => ({ ...prev, search: searchFromUrl }))
        }
    }, [])

    return (
        <div>
            <Navbar />
            <Banner page="shop" />

            <div className="shop-container">
                {/* FILTERS */}
                <Filters
                    filters={filters}
                    onChange={setFilters}
                    isOpen={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                />

                {/* PRODUCTS */}
                <div className="shop-main">
                    {/* TOOLBAR */}
                    <div className="shop-toolbar">
                        <button 
                            className="shop-filter-btn"
                            onClick={() => setFiltersOpen(true)}
                        >
                            Filters
                        </button>
                        <p className="shop-count">{products.length} products</p>
                    </div>

                    {/* GRID */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="shop-grid">
                            {products.map(product => (
                                <div key={product.id} className="shop-card">
                                    <p>{product.brand} {product.model}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Shop