import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PolicyContent from '../components/PolicyContent'
import { Helmet } from 'react-helmet-async'

function TermsConditions() {
    return (
        <div>
            <Helmet>
                <title>Terms &amp; Conditions | Danyaal Shop</title>
                <meta name="description" content="Read the Terms and Conditions for using Danyaal Shop. Understand your rights and responsibilities when purchasing from our online phone store." />
            </Helmet>
            <Navbar />
            <PolicyContent page="terms" />
            <Footer />
        </div>
    )
}

export default TermsConditions