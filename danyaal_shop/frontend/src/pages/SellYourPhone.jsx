import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import SellYourPhoneForm from '../components/SellYourPhoneForm'
import { Helmet } from 'react-helmet-async'

function SellYourPhone() {
    return (
        <div>
            <Helmet>
                <title>Sell Your Phone | Get an Instant Quote — Danyaal Shop</title>
                <meta name="description" content="Sell your used iPhone, Samsung, or any smartphone quickly and easily. Get an instant quote from Danyaal Shop — fast payment, hassle-free process." />
            </Helmet>
            <Navbar />
            <Banner page="sell" />
            <SellYourPhoneForm />
            <Footer />
        </div>
    )
}

export default SellYourPhone