import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo-client";
import { seedDemoData } from "./services/api";

// Initialize bid demo data on first load
seedDemoData()
    .then(() => {
        console.log("Bid demo data initialized");
    })
    .catch((error) => {
        console.error("Failed to initialize bid demo data:", error);
    });

createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </ApolloProvider>
);
