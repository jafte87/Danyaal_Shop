import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PolicyContent from '../components/PolicyContent'
import { Helmet } from 'react-helmet-async'

function ReturnsRefundPolicy() {
    return (
        <div>
            <Helmet>
                <title>Returns &amp; Refund Policy | Danyaal Shop</title>
                <meta name="description" content="Read our Returns and Refund Policy at Danyaal Shop. We make returns easy — learn how to return a phone and claim a refund within our policy period." />
            </Helmet>
            <Navbar />
            <PolicyContent page="returns" />
            <Footer />
        </div>
    )
}

export default ReturnsRefundPolicy