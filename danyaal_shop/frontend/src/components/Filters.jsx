import { useState, useEffect } from 'react'
import './Filters.css'
import { API_BASE_URL } from '../config'

function Filters({ filters, onChange, isOpen, onClose }) {
    const [options, setOptions] = useState({
        brands: [],
        colours: [],
        storages: [],
        conditions: []
    })

    const [openSections, setOpenSections] = useState({
        special: true,
        brand: true,
        condition: true,
        storage: true,
        colour: true,
        price: true,
    })

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products/filters/`)
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.error(err))
    }, [])

    const toggle = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Click same value again → deselect (set to empty string)
    const handleToggleFilter = (key, value) => {
        if (filters[key] === value) {
            onChange({ ...filters, [key]: '' })
        } else {
            onChange({ ...filters, [key]: value })
        }
    }

    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value })
    }

    const FilterOption = ({ filterKey, value, label }) => {
        const active = filters[filterKey] === value
        return (
            <button
                className={`filter-option-btn ${active ? 'active' : ''}`}
                onClick={() => handleToggleFilter(filterKey, value)}
                type="button"
            >
                <span className={`filter-checkbox ${active ? 'checked' : ''}`} />
                {label}
            </button>
        )
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

                {/* SPECIAL */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('special')}>
                        Categories <span>{openSections.special ? '−' : '+'}</span>
                    </button>
                    {openSections.special && (
                        <div className="filter-options">
                            <FilterOption filterKey="is_best_seller" value="true" label="Best Sellers" />
                            <FilterOption filterKey="is_new_arrival" value="true" label="New Arrivals" />
                            <FilterOption filterKey="is_featured" value="true" label="Featured Products" />
                        </div>
                    )}
                </div>

                {/* BRAND */}
                <div className="filter-section">
                    <button className="filter-title" onClick={() => toggle('brand')}>
                        Brand <span>{openSections.brand ? '−' : '+'}</span>
                    </button>
                    {openSections.brand && (
                        <div className="filter-options">
                            {options.brands.map(brand => (
                                <FilterOption key={brand} filterKey="brand" value={brand} label={brand} />
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
                                <FilterOption
                                    key={c}
                                    filterKey="condition"
                                    value={c}
                                    label={c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                />
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
                                <FilterOption key={s} filterKey="storage" value={s} label={s} />
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
                                <FilterOption key={c} filterKey="colour" value={c} label={c} />
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