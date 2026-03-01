# Luxe — Premium Ecommerce Store

A full-stack premium ecommerce platform with luxury aesthetics, built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Running the Application

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend App
```bash
cd frontend
npm install
npm run dev
```

## Testing Options
- **Backend**: Run `npm test` inside the `/backend` folder. This leverages Jest + Supertest for robust API controller validation.
- **Frontend E2E**: Run `npx cypress run` in the `/frontend` directory to simulate complete user flows (like product discovery and checkout) in a headless environment.

## Deployment Guide
### Backend (Render / Heroku)
1. Add environment variables (MONGODB_URI, JWT_SECRET, STRIPE_SECRET_KEY) to your provider.
2. Ensure the startup command is set to `node server.js` or `npm start`.

### Frontend (Vercel / Netlify)
1. Import the frontend repository to Vercel.
2. Set `VITE_API_URL` environment variable if your backend is hosted differently than `/api`.
3. The build command `npm run build` is automatically configured via Vite.

---

> **Note:** Seed credentials are provided for initial exploration. For a complete production setup, ensure that all secrets are replaced and MongoDB restrictions are configured correctly.

## 📁 Project Structure

```
ecommerce/
├── frontend/              # React + Vite app
│   └── src/
│       ├── context/       # CartContext, AuthContext
│       ├── components/    # Navbar, CartSidebar, ProductCard, HeroSection, etc.
│       ├── pages/         # All 10 pages (Home, Products, Cart, Checkout, Auth, etc.)
│       └── assets/        # Images
│
└── backend/               # Node.js + Express API
    ├── models/            # User, Product, Order, Review (Mongoose schemas)
    ├── routes/            # auth, products, cart, orders, users, admin, webhook
    ├── middleware/        # auth (JWT), errorHandler
    └── seeds/             # seed.js — bootstrap sample data
```

## 🎨 Design System

- **Background**: `#EAF1FF` (soft luxury blue)
- **Primary**: `#1A1A2E` (deep navy)
- **Accent**: `#B8860B` (antique gold)
- **Fonts**: Playfair Display (headings) + Inter (body)

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login user |
| POST | /api/auth/refresh | — | Refresh JWT |
| GET | /api/products | — | List products (filter/sort/paginate) |
| GET | /api/products/:slug | — | Product detail |
| GET | /api/cart | 🔒 | Get cart |
| POST | /api/cart | 🔒 | Add/update cart item |
| POST | /api/orders | 🔒 | Create order + Stripe PaymentIntent |
| GET | /api/orders | 🔒 | User's orders |
| GET | /api/user/me | 🔒 | Get profile |
| GET | /api/admin/dashboard | 👑 | Admin dashboard stats |
| GET | /api/admin/orders | 👑 | All orders |
| POST | /api/webhook/payment | — | Stripe webhook |

## 🔑 Environment Variables

See `backend/.env.example` for all required variables. Key ones:

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — JWT signing secret
- `STRIPE_SECRET_KEY` — Stripe API key (test: `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

## 🌱 Seed Data

```bash
cd backend
node seeds/seed.js
```

Creates:
- **Admin**: `admin@luxe.store` / `Admin@123456`
- **User**: `user@luxe.store` / `User@123456`
- **12 Products** across Arts, Outfits, Study, Sports

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v6 |
| Styling | Vanilla CSS with custom properties |
| State | React Context + useReducer |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe PaymentIntents |
| Security | Helmet, CORS, express-rate-limit |

## 🚀 Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import in Vercel; set `VITE_API_URL` to your backend URL

### Backend → Render / Railway
1. Push `backend/` to GitHub
2. Set all environment variables from `.env.example`
3. Set start command: `node server.js`

## 📱 Features

- ✅ Premium luxury UI (Playfair Display + Inter)
- ✅ Responsive (mobile-first)
- ✅ Cart with localStorage persistence
- ✅ JWT auth with refresh token rotation
- ✅ Multi-step checkout
- ✅ Stripe Payment integration
- ✅ Admin panel (dashboard, products CRUD, order management)
- ✅ Rate limiting + Helmet security
- ✅ Product filtering, sorting, pagination
- ✅ Text search with MongoDB full-text index
