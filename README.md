# Kawaii Escorts

A modern escort directory platform built with Next.js 16, NestJS 11, and PostgreSQL.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Zod** - Schema validation
- **next-intl** - Internationalization (EN/RU)
- **TailwindCSS 4** - Styling

### Backend
- **NestJS 11** - Node.js framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Passport + JWT** - Authentication
- **Stripe** - Payment processing

## Project Structure

```
kawaii-escorts/
├── frontend/              # Next.js 16 frontend app (@kawaii/web)
├── apps/
│   └── api/              # NestJS 11 backend app (@kawaii/api)
├── packages/
│   ├── database/         # Prisma schema and migrations
│   └── shared/           # Shared utilities and types
└── features/             # Feature-based modules (optional)
```

## Features

- **User Authentication** - Register, login, JWT tokens
- **Profile Management** - CRUD operations for escort profiles
- **Search & Filters** - Search by city, age, gender
- **Shopping Cart** - Add profiles to cart with pricing plans
- **Payment Integration** - Stripe checkout
- **Multi-language** - English and Russian support with transliteration
- **Responsive Design** - Mobile-friendly UI

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Yarn

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up the database:
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp frontend/.env.example frontend/.env

# Update DATABASE_URL in apps/api/.env

# Run migrations
yarn db:push

# Seed cities
yarn db:seed
```

3. Start development servers:
```bash
yarn dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Cities
- `GET /cities?lang=en|ru` - Get all cities
- `GET /cities/:slug` - Get city by slug

### Profiles
- `GET /profiles` - Get all profiles (with filters)
- `GET /profiles/:id` - Get profile by ID
- `POST /profiles` - Create profile
- `PUT /profiles/:id` - Update profile
- `DELETE /profiles/:id` - Delete profile

### Search
- `GET /search?city=&minAge=&maxAge=&gender=&lang=` - Search profiles

### Cart
- `GET /cart?sessionId=` - Get cart items
- `POST /cart` - Add item to cart
- `DELETE /cart/:id` - Remove item from cart
- `DELETE /cart?sessionId=` - Clear cart

### Payments
- `POST /payments` - Create payment
- `POST /payments/:id/checkout` - Create Stripe checkout session
- `POST /payments/webhook` - Stripe webhook handler

## Environment Variables

### Backend (apps/api/.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kawaii_escorts"
JWT_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### Frontend (frontend/.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Schema

- **users** - User accounts
- **cities** - City list (EN/RU)
- **profiles** - Escort profiles
- **cart_items** - Shopping cart items
- **payments** - Payment history

## License

MIT
