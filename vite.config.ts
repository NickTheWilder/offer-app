import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This is a frontend-only Vite configuration
// When connecting to a real backend, you'll need to configure proxy settings
// to route API requests to your backend server.

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
          "/graphql": {
            target: "http://localhost:5000",
            secure: false,
          }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@shared": path.resolve(__dirname, "shared"),
            "@assets": path.resolve(__dirname, "./attached_assets"),
        },
    },
});
