import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutUsContent from '../components/AboutUsContent'
import { Helmet } from 'react-helmet-async'

function AboutUs() {
    return (
        <div>
            <Helmet>
                <title>About Us | Danyaal Shop — Premium Used Phones UK</title>
                <meta name="description" content="Learn about Danyaal Shop — your trusted UK source for high-quality used iPhones, Samsung, and more. Honest prices, genuine phones, and outstanding service." />
            </Helmet>
            <Navbar />
            <AboutUsContent />
            <Footer />
        </div>
    )
}

export default AboutUs