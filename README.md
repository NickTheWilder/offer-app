# Church Bazaar Auction Software - Frontend

This is the frontend implementation of a church bazaar auction software MVP designed to compete with platforms like Give Smart and Greater Giving. The application provides a cleaner, more intuitive interface with simplified workflows and better mobile experience.

## Features

- Authentication system with login/register capabilities
- Admin dashboard for managing auction items
- Silent auction bidding system with real-time updates
- Responsive design optimized for mobile devices
- Item filtering by category and status
- GraphQL integration ready for backend connection

## Tech Stack

- React 18 with TypeScript
- React Hook Form for form handling
- Apollo Client for GraphQL data fetching
- React Query for additional state management
- CSS Modules for component styling
- Wouter for routing
- GraphQL Code Generator for type-safe API calls

## Project Structure

```
src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and client setup
├── pages/             # Page components
├── services/          # API services and mock data
├── types/             # TypeScript type definitions
│   └── generated/     # Auto-generated GraphQL types
└── App.tsx            # Main application component
shared/
└── schema.ts          # Shared data models
```

## Getting Started

### Prerequisites

This project uses [Bun](https://bun.sh/) as the JavaScript runtime and package manager. Install Bun first if you haven't already.

### Development

```bash
# Install dependencies
bun install

# Start development server (includes GraphQL proxy)
bun run dev

# Generate GraphQL types (when schema changes)
bun run codegen
```

## Backend Integration

This frontend is designed to work with a GraphQL backend API. The application includes:

### GraphQL Setup

- **Apollo Client** configured to connect to `/graphql` endpoint
- **Vite proxy** routes GraphQL requests to `http://localhost:5000`
- **Code generation** creates TypeScript types from GraphQL schema
- **Mock services** provide fallback data during development

### Backend Connection Status

The application currently supports:

- ✅ GraphQL client configuration ready
- ✅ Type-safe GraphQL queries and mutations
- ✅ Mock data services for independent development
- ⚠️ Authentication integration pending
- ⚠️ Real-time subscriptions not yet implemented

### Switching from Mock to Real API

1. Start your GraphQL backend server on `http://localhost:5000/graphql`
2. Update `src/services/graphql-api.ts` to use real GraphQL operations
3. Configure authentication in `src/hooks/use-auth.tsx` for your auth system
4. Remove or replace mock data in `src/services/api.ts`

## Authentication

The application uses a context-based authentication system. In the mock implementation, user sessions are stored in localStorage. When connecting to a real backend, update the authentication logic to use tokens, cookies, or other session management approaches as needed.

## Data Models

The data models are defined in the shared schema file. These models define the structure of the application's data and are used throughout the frontend. When connecting to a real backend, ensure that these models align with your backend's data structure.
