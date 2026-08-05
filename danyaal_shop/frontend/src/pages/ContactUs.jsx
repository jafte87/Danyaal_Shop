import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import ContactForm from '../components/ContactForm'
import { Helmet } from 'react-helmet-async'

function ContactUs() {
    return (
        <div>
            <Helmet>
                <title>Contact Us | Danyaal Shop</title>
                <meta name="description" content="Get in touch with Danyaal Shop. Reach us via our contact form, WhatsApp, email or phone. We're happy to help with any questions about your order or our phones." />
            </Helmet>
            <Navbar />
            <Banner page="contact" compact />
            <ContactForm />
            <Footer />
        </div>
    )
}

export default ContactUs