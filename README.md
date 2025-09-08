## Farmer Market

A full‑stack marketplace connecting farmers and buyers. The frontend is a React + Vite app; the backend is an Express API powered by Prisma with a SQLite database. Users can browse listings, place bids, and authenticate via phone-based OTP.

### Features
- **Listings**: Create and view crop listings with quantity/unit and minimum price.
- **Bids**: Submit bids against listings.
- **Auth (OTP)**: Phone-based login with role support (farmer/buyer).
- **Price board & dashboards**: Buyer and farmer views, plus equipment rental page.

### Tech Stack
- **Frontend**: React 19, Vite 7, React Router, Tailwind CSS 4, Framer Motion
- **Backend**: Node.js, Express, Prisma ORM, SQLite, CORS, Morgan, JSON Web Tokens, Twilio (OTP)

---

## Project Structure

```
Farmer-Market/
  src/                 # React app (Vite)
  backend/             # Express API + Prisma
    prisma/            # Prisma schema + migrations (SQLite)
    src/routes/        # auth, listings, bids routers
    src/server.js      # API entry
```

Frontend routes (from `src/App.jsx`): `/`, `/login`, `/farmer`, `/buyer`, `/prices`, `/equipment`

API base: `http://localhost:3000`
- Health: `GET /health`
- Auth: `POST /auth/...`
- Listings: `/listings`
- Bids: `/bids`

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Quick Setup (Recommended)

Run the setup script to automatically install dependencies and configure the project:

```bash
./setup.sh
```

This will:
- Install all dependencies (frontend + backend)
- Create environment files from examples
- Set up the database with Prisma
- Generate Prisma client

### Manual Setup

If you prefer to set up manually:

#### 1) Install dependencies

```bash
# Frontend (root)
npm install

# Backend
cd backend
npm install
```

#### 2) Environment variables

**Backend**: Copy `backend/.env.example` to `backend/.env`:
```bash
cd backend
cp .env.example .env
```

**Frontend**: Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

The example files contain all necessary defaults. For development, you can use the defaults as-is. The backend will use dev OTP mode when Twilio is not configured.

#### 3) Prisma setup (Backend)

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

This uses SQLite with the schema in `backend/prisma/schema.prisma` (models: `Listing`, `Bid`, `User`, `OtpCode`).

### Run in development

```bash
# Backend (http://localhost:3000)
cd backend
npm run dev

# Frontend (http://localhost:5173)
cd ..
npm run dev
```

### Testing Login

The backend runs in dev OTP mode by default (no Twilio required). When you request an OTP, check the backend console for the generated code to use for login.

---

## Scripts

Frontend (root `package.json`):
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — run ESLint

Backend (`backend/package.json`):
- `npm run dev` — start API with nodemon
- `npm start` — start API
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — run Prisma migrations
- `npm run prisma:studio` — open Prisma Studio

---

## API Overview

Base URL: `http://localhost:3000`

- `GET /health` — service check
- `POST /auth/*` — OTP-based authentication endpoints (uses Twilio)
- `GET/POST /listings` — list or create listings
- `POST /bids` — place a bid on a listing

See `backend/src/routes/` for details.

---

## Notes
- Default CORS origin is `http://localhost:5173` (configurable via `CORS_ORIGIN`).
- Ensure `JWT_SECRET` is set in production.
- SQLite DB file lives under `backend/prisma/dev.db` by default.

---

## License
This project is currently unlicensed. Add a license file if needed.
