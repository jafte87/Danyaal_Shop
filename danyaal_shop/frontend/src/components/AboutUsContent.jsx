import { useState, useEffect } from 'react'
import './AboutUsContent.css'
import { API_BASE_URL } from '..\config'

function AboutUsContent() {
    const [about, setAbout] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(${API_BASE_URL}/api/about/')
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setAbout(data[0])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="about-loading">Loading...</div>
    if (!about) return <div className="about-loading">Content coming soon...</div>

    return (
        <div className="about-container">
            {/* HERO SECTION */}
            <div className="about-hero">
                <div className="about-hero-text">
                    <h1 className="about-title">{about.title}</h1>
                    <p className="about-description">{about.description}</p>
                </div>
                {about.image && (
                    <div className="about-hero-image">
                        <img src={about.image} alt={about.title} />
                    </div>
                )}
            </div>

            {/* MISSION */}
            {about.mission && (
                <div className="about-mission">
                    <h2 className="about-mission-title">Our Mission</h2>
                    <p className="about-mission-text">{about.mission}</p>
                </div>
            )}

            {/* WHY CHOOSE US */}
            <div className="about-why">
                <h2 className="about-why-title">Why Choose Us</h2>
                <div className="about-why-grid">
                    <div className="about-why-card">
                        <span className="about-why-icon">✓</span>
                        <h3>Quality Guaranteed</h3>
                        <p>Every device is thoroughly tested and certified before sale.</p>
                    </div>
                    <div className="about-why-card">
                        <span className="about-why-icon">✓</span>
                        <h3>12 Month Warranty</h3>
                        <p>All phones come with a full 12 month warranty for peace of mind.</p>
                    </div>
                    <div className="about-why-card">
                        <span className="about-why-icon">✓</span>
                        <h3>Fast Delivery</h3>
                        <p>Next day delivery available on all orders placed before 3pm.</p>
                    </div>
                    <div className="about-why-card">
                        <span className="about-why-icon">✓</span>
                        <h3>Easy Returns</h3>
                        <p>Not happy? Return within 14 days for a full refund, no questions asked.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUsContent