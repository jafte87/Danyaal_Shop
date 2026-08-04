import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import { FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay} from 'react-icons/si'
import { useState } from 'react'
import './Footer.css'

function Footer() {

    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
        const res = await fetch('http://127.0.0.1:8000/api/newsletter/', {
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
                    {/* SOCIAL */}
                    <div className="footer-social">
                        <a href="" target="_blank" rel="noreferrer"><FiInstagram /></a>
                        <a href="" target="_blank" rel="noreferrer"><FiFacebook /></a>
                        <a href="" target="_blank" rel="noreferrer"><FaTiktok /></a>
                        <a href="" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
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
                <p className="footer-copy">© 2026 Your Brand. All rights reserved.</p>

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