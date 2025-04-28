import { QueryClient } from "@tanstack/react-query";

/**
 * Mock API Query Client
 *
 * This file has been refactored to remove real API calls, since we're
 * using mock services for the frontend-only version.
 *
 * In a real application with a backend API, you would:
 * 1. Restore the apiRequest function
 * 2. Implement proper error handling
 * 3. Configure proper authentication handling
 */

// Keep the query client configuration for use with our mock services
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
