import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import './SellYourPhoneForm.css'

function SellYourPhone() {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        storage: '',
        condition: '',
        network: '',
        imei: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        notes: '',
    })
    const [images, setImages] = useState([])
    const [dragging, setDragging] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFiles = (files) => {
        const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
        setImages(prev => [...prev, ...newFiles].slice(0, 6))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = () => setDragging(false)

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        Object.keys(formData).forEach(key => data.append(key, formData[key]))
        images.forEach(img => data.append('images', img))

        try {
            const res = await fetch('http://127.0.0.1:8000/api/sell/', {
                method: 'POST',
                body: data,
            })
            if (res.ok) {
                setSubmitted(true)
                setFormData({
                    brand: '', model: '', storage: '', condition: '',
                    network: '', imei: '', customer_name: '',
                    customer_email: '', customer_phone: '', notes: '',
                })
                setImages([])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="syp-container">
                <h1 className="syp-title">Sell Your Phone</h1>
                <p className="syp-subtitle">
                    Fill in the details below and we'll get back to you with an instant quote.
                </p>

                {submitted ? (
                    <div className="syp-success">
                        <h2>✓ Submission Received!</h2>
                        <p>We'll review your details and get back to you shortly with a quote.</p>
                    </div>
                ) : (
                    <form className="syp-form" onSubmit={handleSubmit}>

                        {/* PHONE DETAILS */}
                        <div className="syp-section">
                            <h3 className="syp-section-title">Phone Details</h3>
                            <div className="syp-grid">
                                <div className="syp-field">
                                    <label>Brand *</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="e.g. Apple, Samsung"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="syp-field">
                                    <label>Model *</label>
                                    <input
                                        type="text"
                                        name="model"
                                        placeholder="e.g. iPhone 13 Pro"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="syp-field">
                                    <label>Storage *</label>
                                    <select
                                        name="storage"
                                        value={formData.storage}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select storage</option>
                                        <option>64 GB</option>
                                        <option>128 GB</option>
                                        <option>256 GB</option>
                                        <option>512 GB</option>
                                        <option>1 TB</option>
                                    </select>
                                </div>
                                <div className="syp-field">
                                    <label>Condition *</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select condition</option>
                                        <option>Good</option>
                                        <option>Very Good</option>
                                        <option>Excellent</option>
                                        <option>New</option>
                                    </select>
                                </div>
                                <div className="syp-field">
                                    <label>Network *</label>
                                    <select
                                        name="network"
                                        value={formData.network}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select network</option>
                                        <option>Unlocked</option>
                                        <option>EE</option>
                                        <option>O2</option>
                                        <option>Vodafone</option>
                                        <option>Three</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="syp-field">
                                    <label>IMEI (Optional)</label>
                                    <input
                                        type="text"
                                        name="imei"
                                        placeholder="Dial *#06# to find your IMEI"
                                        value={formData.imei}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PHOTO UPLOAD */}
                        <div className="syp-section">
                            <h3 className="syp-section-title">Upload Photos</h3>
                            <div
                                className={`syp-dropzone ${dragging ? 'dragging' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('syp-file-input').click()}
                            >
                                <input
                                    id="syp-file-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <div className="syp-dropzone-content">
                                    <p className="syp-drop-text">Drag & drop photos here or <span>click to browse</span></p>
                                    <p className="syp-drop-hint">Upload up to 6 photos — front, back, sides and any damage</p>
                                </div>
                            </div>

                            {/* IMAGE PREVIEWS */}
                            {images.length > 0 && (
                                <div className="syp-previews">
                                    {images.map((img, index) => (
                                        <div key={index} className="syp-preview">
                                            <img src={URL.createObjectURL(img)} alt={`upload ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="syp-remove"
                                                onClick={() => removeImage(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CONTACT DETAILS */}
                        <div className="syp-section">
                            <h3 className="syp-section-title">Your Details</h3>
                            <div className="syp-grid">
                                <div className="syp-field">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        placeholder="John Doe"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="syp-field">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        placeholder="john@example.com"
                                        value={formData.customer_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="syp-field">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="customer_phone"
                                        placeholder="+44 7700 000000"
                                        value={formData.customer_phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="syp-field syp-field-full">
                                        <label>Collection Address *</label>
                                    <input
                                        type="text"
                                        name="customer_address"
                                        placeholder="Full address where we can collect your device"
                                        value={formData.customer_address}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        placeholder="Any additional info about your phone..."
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="syp-submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Request Collection'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SellYourPhone