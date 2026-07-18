const BASE_URL = 'http://localhost:8000/api'

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