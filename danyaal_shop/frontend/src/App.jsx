import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import ReturnsRefundPolicy from './pages/Returns&RefundPolicy'
import SellYourPhone from './pages/SellYourPhone'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import WarrantyInformation from './pages/WarrantyInformation'
import TermsConditions from './pages/Terms&Conditions'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/returns-refund-policy" element={<ReturnsRefundPolicy />} />
            <Route path="/sell-your-phone" element={<SellYourPhone />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/warranty-information" element={<WarrantyInformation />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    )
}

export default App