/**
 * Frontend Types
 *
 * This file contains TypeScript interfaces for the frontend application.
 * In a real application with a backend, these would be derived from your database schema.
 * This is a simplified version of the shared schema for frontend-only use.
 */

import { z } from "zod";

// User types
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    bidderNumber: string;
    role: "admin" | "bidder";
    password: string; // In a real app with backend, password would never be exposed to the client
    isActive: boolean;
    createdAt: Date | null;
}

export const insertUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    bidderNumber: z.string().min(1, "Bidder number is required"),
    role: z.enum(["admin", "bidder"]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
