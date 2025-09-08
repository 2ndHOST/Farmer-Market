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

### 1) Install dependencies

```
# Frontend (root)
npm install

# Backend
cd backend
npm install
```

### 2) Environment variables (Backend)
Create `backend/.env` with at least:

```
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Auth
JWT_SECRET=replace-with-a-strong-secret

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

### 3) Prisma setup (Backend)

```
cd backend
npm run prisma:generate
npm run prisma:migrate
```

This uses SQLite with the schema in `backend/prisma/schema.prisma` (models: `Listing`, `Bid`, `User`, `OtpCode`).

### 4) Run in development

```
# Backend (http://localhost:3000)
cd backend
npm run dev

# Frontend (http://localhost:5173)
cd ..
npm run dev
```

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
