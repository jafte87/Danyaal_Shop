import { useRef } from 'react'
import { MdStar, MdStarOutline } from 'react-icons/md'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import './Testimonials.css'

function Testimonials({ testimonials }) {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        })
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            i < rating 
                ? <MdStar key={i} className="star filled" />
                : <MdStarOutline key={i} className="star empty" />
        ))
    }

    return (
        <section className="testimonials">
            <div className="t-banner">
                {/* TOP ROW */}
                <div className="t-top-row">
                    <h2 className="t-title">What Our Customers Say</h2>
                </div>

                {/* SCROLL CONTAINER */}
                <div className="t-scroll-container">
                    <button className="t-scroll-btn" onClick={() => scroll('left')}>
                        <MdChevronLeft />
                    </button>

                    <div className="t-scroll-wrapper" ref={scrollRef}>
                        <div className="t-cards">
                            {testimonials?.map(testimonial => (
                                <div key={testimonial.id} className="t-card">
                                    {/* STARS */}
                                    <div className="t-stars">
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    {/* COMMENT */}
                                    <p className="t-comment">"{testimonial.comment}"</p>

                                    {/* CUSTOMER */}
                                    <div className="t-customer">
                                        <div className="t-avatar">
                                            {testimonial.customer_avatar && testimonial.customer_avatar !== ''
                                            ? <img src={testimonial.customer_avatar} alt={testimonial.customer_name} />
                                            : <span>{testimonial.customer_name?.charAt(0).toUpperCase()}</span>
                                            }
                                        </div>
                                        <p className="t-name">{testimonial.customer_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="t-scroll-btn" onClick={() => scroll('right')}>
                        <MdChevronRight />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Testimonials