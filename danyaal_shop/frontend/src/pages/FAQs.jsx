import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import FAQsContent from '../components/FAQsContent'
import { Helmet } from 'react-helmet-async'

function FAQs() {
    return (
        <div>
            <Helmet>
                <title>FAQs | Danyaal Shop — Frequently Asked Questions</title>
                <meta name="description" content="Find answers to the most frequently asked questions about buying and selling phones at Danyaal Shop, including delivery, warranty, returns, and more." />
            </Helmet>
            <Navbar />
            <Banner page="faqs" compact />
            <FAQsContent />
            <Footer />
        </div>
    )
}

export default FAQs