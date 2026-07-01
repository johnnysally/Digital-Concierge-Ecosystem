# Accommodation Partner Portal - Digital Concierge Ecosystem

## Overview

This is the **Accommodation Partner Portal (PMS + CMS)** for the Digital Concierge Ecosystem—a comprehensive Property Management System for accommodation providers (hotels, BnBs, resorts, etc.).

**Path:** `C:\Users\mwasj\Desktop\Digital-Concierge-Ecosystem\Partners`

**Technology Stack:**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit (state management)
- React Query (server state & sync)
- React Hook Form (forms)
- Axios (HTTP)
- React Router (navigation)
- Framer Motion (animations)

## Project Structure

```
Partners/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root app with providers
│   ├── index.css                   # Tailwind imports
│   ├── layouts/
│   │   └── PartnerLayout.tsx       # Main partner portal layout
│   ├── routes/
│   │   └── index.tsx               # Top-level route aggregator
│   ├── store/
│   │   ├── index.ts                # Redux store configuration
│   │   └── slices/
│   │       ├── propertySlice.ts
│   │       ├── roomSlice.ts
│   │       ├── reservationSlice.ts
│   │       └── guestSlice.ts
│   ├── hooks/
│   │   └── useProperties.ts        # React Query hooks
│   └── modules/                    # Feature modules (each contains pages, services, types, routes)
│       ├── dashboard/
│       ├── property/              # Property CRUD, publishing
│       ├── rooms/                 # Room inventory, pricing
│       ├── reservations/          # Booking management
│       ├── guests/                # Guest profiles
│       ├── housekeeping/          # Cleaning & maintenance
│       ├── staff/                 # Team management
│       ├── payments/              # Revenue, payouts, transactions
│       ├── promotions/            # Discount campaigns
│       ├── reviews/               # Guest feedback
│       ├── analytics/             # Business intelligence
│       ├── notifications/         # Real-time alerts
│       ├── communication/         # Guest messaging
│       ├── documents/             # Compliance docs
│       ├── profile/               # Business profile
│       ├── settings/              # Portal settings
│       └── ai/                    # AI insights & recommendations
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Module Architecture

Each module follows this pattern:

```
module/
├── api/                  # Optional: Direct API endpoints (if not using services)
├── components/           # Reusable UI components
├── hooks/               # Module-specific React Query hooks
├── pages/               # Page components (smart components)
├── routes/              # Route definitions (exported to root routes)
├── services/            # API service functions (business logic)
├── store/               # Redux slices (optional for complex state)
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
└── validation/          # Form validation schemas
```

## Key Features Scaffolded

### Dashboard
- Business KPIs and occupancy overview
- Revenue metrics
- Upcoming check-ins/check-outs
- Real-time notifications

### Property Management
- Create, edit, publish properties
- Multi-property support
- Media management (images, videos, virtual tours)
- Amenities and policies configuration

### Room Management
- Room inventory tracking
- Pricing strategies (seasonal, dynamic)
- Availability calendar
- Room status and maintenance

### Reservations
- Accept/reject bookings
- Modify reservations
- Process refunds
- Waiting list management

### Guest Management
- Guest profiles and history
- Identity verification
- VIP/repeat guest tracking
- Communication history

### Housekeeping
- Cleaning schedules
- Task assignments
- Maintenance requests
- Room inspection reports

### Payments & Finance
- Revenue dashboard
- Payout tracking
- Transaction history
- Commission calculations

### Staff Management
- Employee accounts
- Role-based access
- Attendance tracking
- Performance metrics

### Analytics
- Occupancy trends
- Revenue forecasting
- Booking patterns
- Guest demographics

### AI Business Assistant
- Price recommendations
- Demand forecasting
- Occupancy optimization
- Performance insights

## Data Flow

1. **Partner Portal** (this app) owns and publishes accommodation data
2. **Backend APIs** store and expose data through REST endpoints
3. **Shared Database** provides single source of truth
4. **Other Portals** (Customer, Restaurant, Rider, Admin) consume published data via API Gateway
5. **Real-time Sync** keeps all portals synchronized

## Setup & Installation

```bash
cd C:\Users\mwasj\Desktop\Digital-Concierge-Ecosystem\Partners

# Install dependencies
npm install

# Development server (runs on port 3001)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Integration with Frontend

The partner routes are automatically integrated into the main app router at:
- Import: `frontend/src/app/router/index.tsx`
- Route path: `/partners/accommodation`

Partner portal routes are accessible under `/partners/accommodation/*`

## API Endpoints

All service calls use the backend API proxy configured in `vite.config.ts`:
- Base: `/api/partners/accommodation/`
- Examples:
  - `GET /api/partners/accommodation/property` — List properties
  - `POST /api/partners/accommodation/property` — Create property
  - `GET /api/partners/accommodation/rooms` — List rooms
  - `POST /api/partners/accommodation/reservations/:id/confirm` — Confirm booking

## State Management

### Redux (for local UI state)
- `property` — Current/selected property
- `room` — Room inventory state
- `reservation` — Reservation list state
- `guest` — Guest profiles state

### React Query (for server state)
- Query keys: `['properties']`, `['rooms']`, `['reservations']`, etc.
- Auto-refetch on window focus
- Built-in caching and invalidation

### Forms
- `react-hook-form` for reactive form handling
- Type-safe form validation with TypeScript

## Development Workflow

1. **Create a feature branch** for new modules
2. **Add module folder** under `src/modules/`
3. **Create standard files:** `types/`, `services/`, `pages/`, `routes/`
4. **Implement pages** using React Hook Form + React Query
5. **Export routes** from `module/routes/index.tsx`
6. **Wire into** `src/routes/index.tsx`
7. **Test** with `npm run build`
8. **Deploy** through platform CI/CD

## Best Practices

- ✅ Keep business logic in `services/` and Redux slices
- ✅ Use React Query for all API calls (automatic sync)
- ✅ Type everything with TypeScript
- ✅ Use Tailwind CSS for styling
- ✅ Follow feature-first folder structure
- ✅ Implement role-based route protection in layout
- ❌ Don't put API calls directly in components
- ❌ Don't duplicate state management (Redux + Query)
- ❌ Don't create custom hooks without documentation

## Next Steps

1. ✅ Core scaffold complete
2. ⬜ Implement authentication & JWT tokens
3. ⬜ Add role-based access control (RBAC) in PartnerLayout
4. ⬜ Build out UI components library (buttons, cards, modals)
5. ⬜ Implement real-time sync with WebSockets
6. ⬜ Add comprehensive error handling & logging
7. ⬜ Create unit tests for services
8. ⬜ Setup E2E testing with Playwright
9. ⬜ Performance optimization (code splitting, lazy loading)
10. ⬜ Deploy to production environment

