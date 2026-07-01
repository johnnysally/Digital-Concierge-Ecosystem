# Digital Concierge Ecosystem

This repository contains the main Digital Concierge Ecosystem workspace, with two independent frontend applications:

- `Customer/` - Customer-facing portal built with Vite, React, TypeScript, and Tailwind CSS.
- `Partners/` - Partner accommodation portal built with Vite, React, TypeScript, and Tailwind CSS.

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
