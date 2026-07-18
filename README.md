# Digital Concierge Ecosystem

This repository contains the main Digital Concierge Ecosystem workspace, with a customer-facing experience and an accommodation partner operations portal built on the same backend services.

## How the Accommodation Portal Works

The accommodation portal is the operations workspace for hotel and property partners. It allows a partner to:

- manage properties, rooms, staff, and promotions
- view and update reservations and guest records
- monitor occupancy, analytics, and guest care follow-ups
- manage housekeeping readiness and operational alerts
- receive notifications and review performance from a central dashboard

The portal is powered by a React + TypeScript frontend and connects to the shared Node.js/Express backend through accommodation-specific APIs for properties, reservations, guests, rooms, staff, analytics, notifications, and housekeeping.

## How It Connects to the Customer Portal

The customer portal and the accommodation portal are linked through the same backend and shared reservation workflow:

1. A customer browses properties and books a stay through the customer portal.
2. The booking request is sent to the shared backend reservation service.
3. The backend creates or updates a reservation tied to a property, room, and partner account.
4. The accommodation portal receives that reservation through its accommodation APIs and displays it in the reservations, guests, and analytics views.
5. Partner-side updates such as confirmation, check-in, check-out, cancellation, or guest notes are reflected back through the same shared data flow.
6. Notifications and status updates help keep both portals aligned for the customer and the accommodation team.

In short, the customer portal handles the guest experience, while the accommodation portal handles property operations. Both are connected through the same core booking and notification system.

## Repository Structure

- `Customer/`
  - `src/` - Customer app source code
  - `public/` - Static assets and HTML template
  - `package.json` - Customer app dependencies and scripts
  - `vite.config.ts` - Vite configuration for the customer app

- `Partners/`
  - `src/` - Partner app source code
  - `package.json` - Partner app dependencies and scripts
  - `vite.config.ts` - Vite configuration for the partners app

## Setup

Each app is configured independently. Run the following commands from the app folder.

```bash
cd Customer
npm install
npm run dev
```

```bash
cd Partners
npm install
npm run dev
```

## Build

To build each app for production:

```bash
cd Customer
npm run build
```

```bash
cd Partners
npm run build
```

## Notes

- The root folder is intended as a workspace container for both applications.
- Use the app-specific `package.json` files to manage dependencies.
- The root `.gitignore` file excludes common Node, Vite, editor, and OS artifacts.

## Contact

For questions about this repository, refer to the specific app folders or documentation inside `Customer/README.md` and `Partners/README.md` if available.
====================================================
# Unified Digital Concierge Ecosystem

See project overview below.

## Platform Portals

1. Customer Portal - bookings, rides, food, payments, AI concierge.
2. Accommodation Partner Portal - source of truth for properties, rooms, pricing and reservations.
3. Restaurant Partner Portal - menus, inventory, orders.
4. Rider & Transport Partner Portal - drivers, vehicles, rides and deliveries.
5. Operations Portal - live monitoring and incident management.
6. Finance Portal - revenue, commissions, payouts and reconciliation.
7. Customer Support Portal - tickets, chat and issue resolution.
8. Admin Portal - users, partner verification, moderation and settings.
9. Super Admin Portal - infrastructure, permissions and platform configuration.
10. Business Intelligence Portal (Optional) - executive analytics and forecasting.

## Shared Services
Authentication, AI Concierge, Payments, Wallet, Notifications, Maps, Search, Recommendation Engine, Reporting, Audit Logs.

## Development Order
1. Customer Portal
2. Accommodation Partner Portal
3. Restaurant Partner Portal
4. Rider Portal
5. Customer Support Portal
6. Operations Portal
7. Finance Portal
8. Admin Portal
9. Super Admin Portal
10. Business Intelligence Portal
