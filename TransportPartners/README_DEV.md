# Transport Partner Portal

The Transport Partner Portal for the Unified Digital Concierge Ecosystem.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd TransportPartners
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3003`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/              # Application configuration
├── features/         # Feature modules
│   └── transport/
│       ├── dashboard/
│       ├── deliveries/
│       ├── earnings/
│       ├── profile/
│       ├── ratings/
│       └── analytics/
├── layouts/          # Layout components
├── shared/           # Shared utilities and types
│   ├── api/
│   ├── services/
│   ├── types/
│   ├── hooks/
│   └── components/
└── main.tsx          # Entry point
```

## Features

- **Dashboard** - Overview of current deliveries and earnings
- **Deliveries** - Manage active and past deliveries
- **Earnings** - Track income and payments
- **Profile** - Manage rider profile and settings
- **Ratings** - View customer ratings and feedback
- **Analytics** - Performance metrics and insights

## Architecture

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Query** - Data fetching and caching
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling

## React Query Configuration

The portal uses a centralized QueryClient to prevent runtime issues with duplicated module instances. See `src/lib/queryClient.ts`.

To ensure consistency:
- Clear Vite cache if encountering React Query errors: `Remove-Item -Recurse -Force node_modules/.vite`
- Always import QueryClient from `src/lib/queryClient.ts`

## API Integration

The portal connects to the backend at `http://localhost:3000/api`. Update `vite.config.ts` to change the API endpoint.

## Contributing

Follow the established patterns from OrdersPage, PromotionsPage, and NotificationsPage in the RestorauntPartners portal for consistent React Query usage.
