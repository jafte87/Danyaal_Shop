import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import { FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay} from 'react-icons/si'
import { useState, useEffect } from 'react'
import './Footer.css'
import { API_BASE_URL } from '../config'

function Footer() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)
    const [social, setSocial] = useState({})

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/social-links/`)
            .then(res => res.json())
            .then(data => setSocial(data))
            .catch(err => console.error(err))
    }, [])

    const handleNewsletter = async (e) => {
        e.preventDefault()
        if (!email) return
        try {
            const res = await fetch(`${API_BASE_URL}/api/newsletter/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            if (res.ok) setSubscribed(true)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <footer className="footer">
            <div className="footer-top">
            
                {/* NEWSLETTER */}
                <div className="footer-col">
                <h4>Newsletter</h4>
                <p className="footer-sell-text">
                Get the latest deals and offers straight to your inbox.
                </p>
                {subscribed ? (
                <p className="footer-subscribed">✓ You're subscribed!</p>
                ) : (
                <form className="footer-newsletter" onSubmit={handleNewsletter}>
                <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                />
                <button type="submit">Subscribe</button>
                </form>
                )}
                </div>

                {/* LOGO + DESCRIPTION */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src="" alt="Logo" />
                    </div>
                    <p className="footer-desc">
                        Premium refurbished phones at unbeatable prices. 
                        Every device tested, certified and warranted.
                    </p>
                    {/* SOCIAL — only render icons that have a URL */}
                    <div className="footer-social">
                        {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer"><FiInstagram /></a>}
                        {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer"><FiFacebook /></a>}
                        {social.tiktok && <a href={social.tiktok} target="_blank" rel="noreferrer"><FaTiktok /></a>}
                        {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a>}
                        {social.x_twitter && <a href={social.x_twitter} target="_blank" rel="noreferrer"><FaXTwitter /></a>}
                        {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer"><FaYoutube /></a>}
                    </div>
                </div>

                {/* SHOP LINKS */}
                <div className="footer-col">
                    <h4>Shop</h4>
                    <ul>
                        <li><Link to="/shop">All Phones</Link></li>
                        <li><Link to="/shop?is_new_arrival=true">New Arrivals</Link></li>
                        <li><Link to="/shop?is_best_seller=true">Best Sellers</Link></li>
                    </ul>
                </div>

                {/* COMPANY LINKS */}
                <div className="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/faqs">FAQs</Link></li>
                        <li><Link to="/warranty-information">Warranty</Link></li>
                    </ul>
                </div>

                {/* LEGAL LINKS */}
                <div className="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/returns-refund-policy">Returns & Refunds</Link></li>
                        <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* SELL YOUR DEVICE */}
                <div className="footer-col">
                    <h4>Sell Your Device</h4>
                    <p className="footer-sell-text">
                        Get instant cash for your old phone. 
                        Quick, easy and hassle-free.
                    </p>
                    <Link to="/sell-your-phone" className="footer-sell-btn">
                        Sell Your Device
                    </Link>
                </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="footer-bottom">
                <p className="footer-copy">© 2026 Danyaal Shop. All rights reserved.</p>

                {/* PAYMENT METHODS */}
                <div className="footer-payments">
                    <SiVisa />
                    <SiMastercard />
                    <SiApplepay />
                    <SiGooglepay />
                </div>
            </div>
        </footer>
    )
}

export default Footer