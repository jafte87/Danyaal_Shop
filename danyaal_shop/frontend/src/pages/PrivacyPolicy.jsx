import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PolicyContent from '../components/PolicyContent'
import { Helmet } from 'react-helmet-async'

function PrivacyPolicy() {
    return (
        <div>
            <Helmet>
                <title>Privacy Policy | Danyaal Shop</title>
                <meta name="description" content="Read the Danyaal Shop Privacy Policy to understand how we collect, use, and protect your personal information when you shop with us." />
            </Helmet>
            <Navbar />
            <PolicyContent page="privacy" />
            <Footer />
        </div>
    )
}

export default PrivacyPolicy