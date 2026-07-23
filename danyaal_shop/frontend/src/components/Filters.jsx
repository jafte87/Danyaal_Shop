import { useState, useEffect } from 'react'
import './Filters.css'

function Filters({ filters, onChange, isOpen, onClose }) {
    const [options, setOptions] = useState({
        brands: [],
        colours: [],
        storages: [],
        conditions: []
    })

    const [openSections, setOpenSections] = useState({
        brand: true,
        condition: true,
        storage: true,
        colour: true,
        price: true,
    })

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/products/filters/')
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.error(err))
    }, [])

    const toggle = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value })
    }

    return (
        <>
            <div
                className={`filters-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`filters ${isOpen ? 'open' : ''}`}>
                <div className="filters-header">
                    <h3>Filters</h3>
                    <button className="filters-close" onClick={onClose}>✕</button>
                </div>

                {/* BRAND */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('brand')}>
                        Brand <span>{openSections.brand ? '−' : '+'}</span>
                    </button>
                    {openSections.brand && (
                        <div className="filter-options">
                            {options.brands.map(brand => (
                                <label key={brand} className="filter-option">
                                    <input
                                        type="radio"
                                        name="brand"
                                        value={brand}
                                        checked={filters.brand === brand}
                                        onChange={() => handleChange('brand', brand)}
                                    />
                                    {brand}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* CONDITION */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('condition')}>
                        Condition <span>{openSections.condition ? '−' : '+'}</span>
                    </button>
                    {openSections.condition && (
                        <div className="filter-options">
                            {options.conditions.map(c => (
                                <label key={c} className="filter-option">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value={c}
                                        checked={filters.condition === c}
                                        onChange={() => handleChange('condition', c)}
                                    />
                                    {c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* STORAGE */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('storage')}>
                        Storage <span>{openSections.storage ? '−' : '+'}</span>
                    </button>
                    {openSections.storage && (
                        <div className="filter-options">
                            {options.storages.map(s => (
                                <label key={s} className="filter-option">
                                    <input
                                        type="radio"
                                        name="storage"
                                        value={s}
                                        checked={filters.storage === s}
                                        onChange={() => handleChange('storage', s)}
                                    />
                                    {s}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* COLOUR */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('colour')}>
                        Colour <span>{openSections.colour ? '−' : '+'}</span>
                    </button>
                    {openSections.colour && (
                        <div className="filter-options">
                            {options.colours.map(c => (
                                <label key={c} className="filter-option">
                                    <input
                                        type="radio"
                                        name="colour"
                                        value={c}
                                        checked={filters.colour === c}
                                        onChange={() => handleChange('colour', c)}
                                    />
                                    {c}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* PRICE */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('price')}>
                        Price <span>{openSections.price ? '−' : '+'}</span>
                    </button>
                    {openSections.price && (
                        <div className="filter-options">
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min £"
                                    value={filters.min_price || ''}
                                    onChange={e => handleChange('min_price', e.target.value)}
                                />
                                <span>—</span>
                                <input
                                    type="number"
                                    placeholder="Max £"
                                    value={filters.max_price || ''}
                                    onChange={e => handleChange('max_price', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className="filters-clear"
                    onClick={() => onChange({})}
                >
                    Clear All Filters
                </button>
            </aside>
        </>
    )
}

export default Filters