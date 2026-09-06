# Danyaal Shop 🛍️

A full-stack e-commerce platform for a UK-based phone reselling business. Built with Django REST Framework and React 19.

## Features

- 📱 Product listings with categories and filtering
- 🛒 Persistent cart (localStorage)
- 💳 Stripe payment integration (GBP)
- 🔐 JWT authentication (login, register, token refresh)
- 📦 Order management with shipping tracking
- ❤️ Wishlist functionality
- 🏷️ Discount & promo code support
- 📢 Banners, FAQs, policies, and contact form

## Tech Stack

**Backend:** Django, Django REST Framework, PostgreSQL  
**Frontend:** React 19, Vite  
**Payments:** Stripe  
**Auth:** JWT  
**Deployment:** Railway (backend) · Vercel (frontend)

## Getting Started

### Backend

```bash
git clone https://github.com/jafte87/danyaal-shop
cd backend
pip install -r requirements.txt
cp .env.example .env  # add your DB and Stripe keys
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
