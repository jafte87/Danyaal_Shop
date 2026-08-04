import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthForms.css'
import { API_BASE_URL } from '../config'

function RegisterForm() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone_number: '',
    })
    const [errors, setErrors] = useState({})
    const [globalError, setGlobalError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!formData.first_name) newErrors.first_name = 'First name is required'
        if (!formData.last_name) newErrors.last_name = 'Last name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email'
        if (!formData.password) newErrors.password = 'Password is required'
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm your password'
        else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match'
        if (formData.phone_number && formData.phone_number.length < 10) newErrors.phone_number = 'Enter a valid phone number'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
    })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    username: formData.email,
                    password: formData.password,
                    phone_number: formData.phone_number,
                    newsletter: false,
                })
            })
            const data = await res.json()
            console.log('Register response:', data) 
            if (res.ok) {
                if (formData.newsletter) {
                    await fetch(`${API_BASE_URL}/api/newsletter/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                    })
                    }
                const loginRes = await fetch(`${API_BASE_URL}/api/auth/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    })
                })
                const loginData = await loginRes.json()
                if (loginRes.ok) {
                    login(loginData.user, loginData.access, loginData.refresh)
                    setSuccess(true)
                    setTimeout(() => navigate('/account'), 1500)
                }
            } else {
                console.log('Registration error:', data) // ← add this
                if (data.email) setGlobalError('An account with this email already exists.')
                else if (data.password) setGlobalError(data.password[0])
                else setGlobalError('Registration failed. Please check your details.')
            }
        } catch (err) {
            setGlobalError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join us today</p>

                {globalError && <p className="auth-error">{globalError}</p>}
                {success && <p className="auth-success">✓ Account created! Redirecting...</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-grid">
                        <div className="auth-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="John"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={errors.first_name ? 'input-error' : ''}
                            />
                            {errors.first_name && <span className="field-error">{errors.first_name}</span>}
                        </div>
                        <div className="auth-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Doe"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={errors.last_name ? 'input-error' : ''}
                            />
                            {errors.last_name && <span className="field-error">{errors.last_name}</span>}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="auth-field">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="+44 7700 000000"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className={errors.phone_number ? 'input-error' : ''}
                        />
                        {errors.phone_number && <span className="field-error">{errors.phone_number}</span>}
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="auth-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="••••••••"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className={errors.confirm_password ? 'input-error' : ''}
                        />
                        {errors.confirm_password && <span className="field-error">{errors.confirm_password}</span>}
                    </div>

                    <label className="auth-checkbox">
                        <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        />
                        I'd like to receive news and offers by email (optional)
                    </label>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterForm