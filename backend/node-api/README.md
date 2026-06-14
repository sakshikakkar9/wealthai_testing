# WealthAI — Node.js API

REST API for the WealthAI fintech platform. Handles all CRUD operations and data serving to React (web) and Flutter (mobile) frontends.

---

## Stack

| Layer        | Technology          |
|--------------|---------------------|
| Runtime      | Node.js 18+         |
| Framework    | Express.js          |
| Database     | PostgreSQL (raw pg) |
| Auth         | JWT (Access 15m + Refresh 7d) |
| Security     | Helmet, CORS        |
| Logging      | Winston             |
| Scheduler    | node-cron           |

---

## Folder Structure

```
wealthai-node-api/
├── index.js                          ← App entry point
├── package.json
├── .env.example                      ← Copy to .env and fill
├── .gitignore
│
├── shared/
│   ├── dbconnection.js               ← PostgreSQL pool (imported by all services)
│   ├── logger.js                     ← Winston logger
│   ├── pythonRunner.js               ← Spawn Python scripts
│   ├── response.js                   ← sendSuccess / sendError helpers
│   ├── scheduler.js                  ← Daily cron jobs
│   └── middleware/
│       ├── auth.middleware.js        ← JWT verify — protects routes
│       └── errorHandler.js          ← Global error handler
│
└── modules/
    ├── auth/
    │   ├── controllers/
    │   │   ├── auth.controller.js    ← Login, register, tokens
    │   │   └── profile.controller.js ← User profiles, broker accounts
    │   ├── routes/
    │   │   └── auth.routes.js
    │   └── services/
    │       ├── auth.services.js
    │       └── profile.services.js
    │
    ├── bond/
    │   ├── controllers/bond.controller.js
    │   ├── routes/bond.routes.js
    │   └── services/bond.services.js
    │
    ├── deposits/
    │   ├── controllers/deposits.controller.js
    │   ├── routes/deposits.routes.js
    │   └── services/deposits.services.js
    │
    ├── mutual-fund/
    │   ├── controllers/
    │   │   ├── mf.crud.controller.js ← Holdings & transactions
    │   │   ├── mf.nav.controller.js  ← Schemes, NAV, Python triggers
    │   │   └── mf.sip.controller.js  ← SIP / STP / SWP
    │   ├── routes/mf.routes.js
    │   └── services/
    │       ├── mf.crud.services.js
    │       ├── mf.nav.services.js
    │       └── mf.sip.services.js
    │
    ├── trading-strategy/
    │   ├── controllers/
    │   │   ├── strategy.controller.js    ← Strategy CRUD, sets, positions
    │   │   ├── deployment.controller.js  ← Deploy, status
    │   │   └── runs.controller.js        ← Runs, trades, positions, logs
    │   ├── routes/strategy.routes.js
    │   └── services/
    │       ├── strategy.services.js
    │       ├── deployment.services.js
    │       └── runs.services.js
    │
    ├── india-market/
    │   ├── controllers/
    │   │   ├── instruments.controller.js ← Symbol search
    │   │   ├── equity.controller.js      ← Holdings, trades, orders, dividends
    │   │   ├── fno.controller.js         ← F&O positions, transactions
    │   │   └── marketdata.controller.js  ← OHLCV, FII/DII, Options, MMI, VIX
    │   ├── routes/market.routes.js
    │   └── services/
    │       ├── instruments.services.js
    │       ├── equity.services.js
    │       ├── fno.services.js
    │       └── marketdata.services.js
    │
    └── portfolio/
        ├── controllers/portfolio.controller.js
        ├── routes/portfolio.routes.js
        └── services/portfolio.services.js
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — fill in DB credentials, JWT secrets, CORS origins
```

### 3. Run DB migrations
```bash
# Run all SQL files in order from the database/migrations/ folder
psql -U postgres -d wealthai_db -f ../database/migrations/001_db_creation.sql
psql -U postgres -d wealthai_db -f ../database/migrations/002_bond.sql
psql -U postgres -d wealthai_db -f ../database/migrations/003_mutual_fund.sql
psql -U postgres -d wealthai_db -f ../database/migrations/004_algo_engine.sql
psql -U postgres -d wealthai_db -f ../database/migrations/005_india_market.sql
psql -U postgres -d wealthai_db -f ../database/migrations/006_deposits.sql
```

### 4. Start the server
```bash
npm run dev     # Development with hot reload
npm start       # Production
```

Server runs on → `http://localhost:3000`

---

## API Base URL
```
http://localhost:3000/api/v1
```

## Health Check
```
GET /health
```

---

## Authentication Flow

```
POST /api/v1/auth/register    → Create account
POST /api/v1/auth/login       → Get access_token + refresh_token
  All protected routes →  Authorization: Bearer <access_token>
POST /api/v1/auth/refresh     → Get new access_token when expired
POST /api/v1/auth/logout      → Invalidate session
```

JWT payload contains: `{ account_id, user_id, role }`
- `account_id` → the login account
- `user_id` → the active user profile (used by all modules to filter data)

---

## Module Base Paths

| Module           | Base Path              |
|------------------|------------------------|
| Auth             | /api/v1/auth           |
| Deposits         | /api/v1/fd             |
| Bonds            | /api/v1/bond           |
| Mutual Funds     | /api/v1/mf             |
| Trading Strategy | /api/v1/strategy       |
| India Market     | /api/v1/market         |
| Portfolio        | /api/v1/portfolio      |

---

## Key Conventions

| Rule | Detail |
|------|--------|
| Controllers | Request/response only — no SQL ever |
| Services | All DB queries and business logic |
| Routes | Express routing + middleware only |
| Errors | Always use `next(err)` — never res.status() in services |
| DB schema | Always prefix — `auth.users`, `bond.bond_holdings` etc. |
| Soft delete | Set `is_deleted = true` — never hard delete user data |
| Timestamps | All use TIMESTAMPTZ — never plain TIMESTAMP |
| Response | Always use `sendSuccess()` / `sendError()` from shared/response.js |

---

## Logs

- Console: coloured output in development
- `logs/error.log` — errors only
- `logs/combined.log` — all log levels


---

## TypeScript Notes

This project uses **TypeScript**. All source files live in `src/`.

### Dev workflow
```bash
npm run dev          # Run with ts-node (no build needed)
npm run dev:watch    # Run with nodemon + ts-node (auto reload)
```

### Production build
```bash
npm run build        # Compiles src/ → dist/
npm start            # Runs compiled dist/index.js
```

### Type definitions
All shared interfaces and types are in `src/shared/types.ts`.
Import them in any file:
```typescript
import { AuthRequest, BondHolding, Deployment } from '../../shared/types';
```
