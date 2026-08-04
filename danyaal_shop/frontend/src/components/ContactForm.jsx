import { useState, useEffect } from 'react'
import './ContactForm.css'
import { API_BASE_URL } from '..\config'

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        const res = await fetch(${API_BASE_URL}/api/contact/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        if (res.ok) {
            setSubmitted(true)
        } else {
            alert('Something went wrong. Please try again.')
        }
    } catch (err) {
        console.error(err)
        alert('Something went wrong. Please try again.')
    } finally {
        setLoading(false)
    }
    }

    const [contactInfo, setContactInfo] = useState(null)

    useEffect(() => {
    fetch(${API_BASE_URL}/api/contact-info/')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) setContactInfo(data[0])
        })
        .catch(err => console.error(err))
    }, [])

    return (
        <div className="contact-container">
            <div className="contact-grid">

                {/* LEFT — INFO */}
                <div className="contact-info">
                    <h1 className="contact-title">Get In Touch</h1>
                    <p className="contact-subtitle">
                        Have a question about a device? Want to sell your phone? 
                        We're here to help.
                    </p>

                    <div className="contact-details">
                        <div className="contact-detail">
                            <span className="contact-detail-label">Email</span>
                            <a href={`mailto:${contactInfo?.email}`}>{contactInfo?.email || 'hello@yourstore.com'}</a>
                        </div>
                            <div className="contact-detail">
                                <span className="contact-detail-label">Phone</span>
                                <a href={`tel:${contactInfo?.phone}`}>{contactInfo?.phone || '+44 1234 567890'}</a>
                            </div>
                            <div className="contact-detail">
                                <span className="contact-detail-label">WhatsApp</span>
                                <a href={`https://wa.me/${contactInfo?.whatsapp}`} target="_blank" rel="noreferrer">
                                    Message us on WhatsApp
                                </a>
                            </div>
                            {contactInfo?.address && (
                                <div className="contact-detail">
                                    <span className="contact-detail-label">Address</span>
                                    <span>{contactInfo.address}</span>
                                </div>
                            )}
                            <div className="contact-detail">
                                <span className="contact-detail-label">Hours</span>
                                <span>{contactInfo?.hours || 'Mon–Fri: 9am – 6pm'}</span>
                            </div>
                        </div>
                    </div>

                {/* RIGHT — FORM */}
                <div className="contact-form-wrapper">
                    {submitted ? (
                        <div className="contact-success">
                            <p>✓ Message sent!</p>
                            <p>We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="contact-field">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="contact-field">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="contact-field">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+44 7700 000000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-field">
                                <label>Subject *</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option>Order Enquiry</option>
                                    <option>Product Question</option>
                                    <option>Sell My Phone</option>
                                    <option>Warranty Claim</option>
                                    <option>Returns & Refunds</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="contact-field contact-field-full">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="contact-submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactForm