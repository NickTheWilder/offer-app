# Offer - Frontend

This is the frontend implementation of the Offer application. This frontend-only version uses mock data services for demonstration purposes and can be deployed independently of the backend.

## Features

- Authentication system with login/register capabilities
- Admin dashboard for managing auction items
- Bidding system for auction items
- Responsive design for both desktop and mobile
- Item filtering by category and status

## Tech Stack

- React 18 with TypeScript
- React Hook Form for form handling
- React Query for data fetching and state management
- CSS Modules for styling
- Wouter for routing

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── services/       # Mock API services
│   └── App.tsx         # Main application component
└── public/             # Static assets
```

## Getting Started

### Development

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## Connecting to a Backend

This frontend application is designed to be easily connected to a real backend API. To connect to a backend:

1. Replace the mock API services in `src/services/api.ts` with real API calls.
2. Configure the Vite dev server proxy in `vite.config.ts` to route API requests to your backend.
3. Update authentication logic in `src/hooks/use-auth.tsx` to work with your backend's authentication system.

### API Service Integration

The mock API service in `src/services/api.ts` follows the same interface that would be expected from a real backend API. When connecting to a real backend, replace each function with actual HTTP requests.

Example:

```typescript
// Replace this mock implementation
export async function getAuctionItems(): Promise<AuctionItem[]> {
    await simulateDelay();
    return mockAuctionItems;
}

// With a real API call
export async function getAuctionItems(): Promise<AuctionItem[]> {
    const response = await fetch("/api/items");
    if (!response.ok) {
        throw new Error("Failed to fetch items");
    }
    return response.json();
}
```

## Authentication

The application uses a context-based authentication system. In the mock implementation, user sessions are stored in localStorage. When connecting to a real backend, update the authentication logic to use tokens, cookies, or other session management approaches as needed.

## Data Models

The data models are defined in the shared schema file. These models define the structure of the application's data and are used throughout the frontend. When connecting to a real backend, ensure that these models align with your backend's data structure.
