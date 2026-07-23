import './BenefitsBanner.css'

function BenefitsBanner({ desktopImage, mobileImage }) {
    return (
        <div className="benefits-banner">
            {desktopImage 
                ? <img src={desktopImage} className="benefits-desktop" alt="benefits" />
                : <div className="benefits-placeholder" />
            }
            {mobileImage
                ? <img src={mobileImage} className="benefits-mobile" alt="benefits" />
                : null
            }
        </div>
    )
}

export default BenefitsBanner