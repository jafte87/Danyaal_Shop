import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import SellYourPhoneForm from '../components/SellYourPhoneForm'

function SellYourPhone() {
    return (
        <div>
            <Navbar />
            <Banner page="sell" />
            <SellYourPhoneForm />
            <Footer />
        </div>
    )
}

export default SellYourPhone