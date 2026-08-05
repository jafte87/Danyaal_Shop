const BASE_URL = 'API_BASE_URL/api'

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
  return res.json()
}

// Products
export const getProducts = () =>
  fetch(`${BASE_URL}/products/`).then(handleResponse)

export const getProduct = (slug) =>
  fetch(`${BASE_URL}/products/${slug}/`).then(handleResponse)

// Auth
export const loginUser = (credentials) =>
  fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(handleResponse)

export const registerUser = (userData) =>
  fetch(`${BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(handleResponse)

const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) return null

    try {
        const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
        })
        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('access_token', data.access)
            return data.access
        }
        return null
    } catch {
        return null
    }
}

export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('access_token')

    const makeRequest = async (accessToken) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })
    }

    let res = await makeRequest(token)

    // if 401 — try refreshing token once
    if (res.status === 401) {
        const newToken = await refreshToken()
        if (newToken) {
            res = await makeRequest(newToken)
        } else {
            // refresh failed — log user out
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
    }

    return res
}