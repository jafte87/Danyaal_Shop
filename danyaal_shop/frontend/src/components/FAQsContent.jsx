import { useState, useEffect } from 'react'
import './FAQsContent.css'

function FAQsContent() {
    const [faqs, setFaqs] = useState([])
    const [loading, setLoading] = useState(true)
    const [openId, setOpenId] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/faqs/')
            .then(res => res.json())
            .then(data => {
                setFaqs(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const toggle = (id) => {
        setOpenId(openId === id ? null : id)
    }

    if (loading) return <div className="faqs-loading">Loading...</div>

    return (
        <div className="faqs-container">
            <h1 className="faqs-title">Frequently Asked Questions</h1>
            <p className="faqs-subtitle">Can't find your answer? <a href="/contact-us">Contact us</a></p>

            <div className="faqs-list">
                {faqs.length === 0 ? (
                    <p className="faqs-empty">No FAQs available yet.</p>
                ) : (
                    faqs.map(faq => (
                        <div
                            key={faq.id}
                            className={`faq-item ${openId === faq.id ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggle(faq.id)}
                            >
                                {faq.question}
                                <span className="faq-icon">
                                    {openId === faq.id ? '−' : '+'}
                                </span>
                            </button>
                            {openId === faq.id && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default FAQsContent