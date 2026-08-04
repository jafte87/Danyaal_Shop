import { useState, useEffect } from 'react'
import './PolicyContent.css'
import { API_BASE_URL } from '..\config'

function PolicyContent({ page }) {
    const [policy, setPolicy] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/policy/${page}/`)
            .then(res => res.json())
            .then(data => {
                setPolicy(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [page])

    if (loading) return <div className="policy-loading">Loading...</div>
    if (!policy || policy.error) return <div className="policy-loading">Content coming soon...</div>

    return (
        <div className="policy-container">
            <h1 className="policy-title">{policy.title}</h1>
            <p className="policy-updated">
                Last updated: {new Date(policy.updated_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })}
            </p>
            <div className="policy-content">
                {policy.content.split('\n').map((paragraph, index) =>
                    paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                )}
            </div>
        </div>
    )
}

export default PolicyContent