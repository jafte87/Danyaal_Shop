import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PolicyContent from '../components/PolicyContent'
import { Helmet } from 'react-helmet-async'

function WarrantyInformation() {
    return (
        <div>
            <Helmet>
                <title>Warranty Information | Danyaal Shop</title>
                <meta name="description" content="Learn about the warranty we provide on all phones sold at Danyaal Shop. Every device is tested and comes with a warranty for your peace of mind." />
            </Helmet>
            <Navbar />
            <PolicyContent page="warranty" />
            <Footer />
        </div>
    )
}

export default WarrantyInformation