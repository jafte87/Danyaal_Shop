import { useState, useEffect } from 'react'
import './BenefitsBanner.css'
import { API_BASE_URL } from '../config'

function BenefitsBanner() {
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/benefits-banner/`)
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setBanner(data)
                }
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="benefits-banner">
            {banner?.desktop_image 
                ? <img src={banner.desktop_image} className="benefits-desktop" alt="benefits" />
                : <div className="benefits-placeholder" />
            }
            {banner?.mobile_image
                ? <img src={banner.mobile_image} className="benefits-mobile" alt="benefits" />
                : null
            }
        </div>
    )
}

export default BenefitsBanner