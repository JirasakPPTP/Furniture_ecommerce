# Furniture E-commerce Monorepo

Production-ready full-stack furniture and home decoration e-commerce application.

## Tech Stack

### Frontend
- Vite
- React
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```text
furniture-ecommerce/
 ?ÄÄ frontend/
 ³   ?ÄÄ src/
 ³   ³   ?ÄÄ components/
 ³   ³   ?ÄÄ pages/
 ³   ³   ?ÄÄ context/
 ³   ³   ?ÄÄ hooks/
 ³   ³   ?ÄÄ services/
 ³   ³   ?ÄÄ App.jsx
 ³   ³   ÀÄÄ main.jsx
 ³   ?ÄÄ package.json
 ³   ?ÄÄ tailwind.config.js
 ³   ÀÄÄ postcss.config.js
 ³
 ?ÄÄ backend/
 ³   ?ÄÄ controllers/
 ³   ?ÄÄ models/
 ³   ?ÄÄ routes/
 ³   ?ÄÄ middleware/
 ³   ?ÄÄ config/
 ³   ?ÄÄ seed/
 ³   ?ÄÄ utils/
 ³   ?ÄÄ server.js
 ³   ÀÄÄ package.json
 ³
 ÀÄÄ README.md
```

## Features

### Customer
- Browse products
- Search products
- Filter by category
- Product detail page
- Add to cart
- Update cart quantity
- Checkout
- User registration/login
- Order history

### Admin
- Manage products (create/delete in UI, full CRUD in API)
- Manage categories
- Manage orders (status update)
- Manage users

## Backend API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Categories
- `GET /api/products/categories/list`
- `POST /api/products/categories` (admin)
- `DELETE /api/products/categories/:id` (admin)

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status` (admin)

### Users
- `GET /api/users` (admin)
- `DELETE /api/users/:id` (admin)

## Database Models

### User
- `name`
- `email`
- `password`
- `role`
- `createdAt`

### Product
- `name`
- `description`
- `price`
- `category`
- `images`
- `stock`
- `rating`
- `createdAt`

### Order
- `user`
- `items[]`
- `totalPrice`
- `status`
- `shippingAddress`
- `paymentMethod`

### Category
- `name`

## Setup

1. Install dependencies:

```bash
npm install
npm install --workspace backend
npm install --workspace frontend
```

2. Configure environments:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

3. Start development servers:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Seed Example Data

```bash
npm run seed
```

Seed credentials:
- Admin: `admin@furniture.com` / `Admin@123`
- Customer: `customer@furniture.com` / `Customer@123`

## Production Notes

- Use strong `JWT_SECRET` and managed MongoDB credentials.
- Add request validation layer (Joi/Zod) for stricter payload checks.
- Integrate payment provider for real checkout flow.
- Add automated tests (unit/integration/e2e) and CI pipeline.
