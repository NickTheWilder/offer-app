import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { seedDemoData } from "./services/api";

// Initialize demo data on first load
// In a real application with a backend, this would be unnecessary
seedDemoData()
    .then(() => {
        console.log("Demo data initialized");
    })
    .catch((error) => {
        console.error("Failed to initialize demo data:", error);
    });

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </QueryClientProvider>
);
