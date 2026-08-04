import { useState, useEffect } from 'react'
import './Banner.css'
import { API_BASE_URL } from '..\config'

function Banner({ page = 'home' }) {
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/banners/?page=${page}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setBanner(data[0])
            })
            .catch(err => console.error(err))
    }, [page])

    if (!banner) {
        return (
            <div className="banner-placeholder">
                <p>{page} banner</p>
            </div>
        )
    }

    return (
        <div className="banner">
            <img src={banner.image} className="banner-desktop" alt="banner" />
            {banner.mobile_image && (
                <img src={banner.mobile_image} className="banner-mobile" alt="banner" />
            )}
        </div>
    )
}

export default Banner