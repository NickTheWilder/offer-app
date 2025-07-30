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

// Auction Item types
export interface AuctionItem {
    id: number;
    name: string;
    description: string | null;
    images: string[] | null;
    startingBid: number;
    minimumBidIncrement: number;
    buyNowPrice: number | null;
    estimatedValue: number | null;
    category: string;
    tags: string[] | null;
    auctionType: "silent";
    displayOrder: number;
    donorName: string | null;
    donorPublic: boolean;
    startTime: Date | null;
    endTime: Date | null;
    status: "draft" | "published" | "active" | "sold" | "unsold";
    restrictions: string | null;
    additionalDetails: Record<string, any> | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const insertAuctionItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    images: z.array(z.string()).nullable().optional(),
    startingBid: z.number().min(0, "Starting bid must be at least 0"),
    minimumBidIncrement: z.number().min(0).default(5),
    buyNowPrice: z.number().nullable().optional(),
    estimatedValue: z.number().nullable().optional(),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).nullable().optional(),
    auctionType: z.literal("silent").default("silent"),
    displayOrder: z.number().default(0),
    donorName: z.string().nullable().optional(),
    donorPublic: z.boolean().default(false),
    startTime: z.date().nullable().optional(),
    endTime: z.date().nullable().optional(),
    status: z.enum(["draft", "published", "active", "sold", "unsold"]).default("draft"),
    restrictions: z.string().nullable().optional(),
    additionalDetails: z.record(z.any()).nullable().optional(),
});

export type InsertAuctionItem = z.infer<typeof insertAuctionItemSchema>;

// Bid types
export interface Bid {
    id: number;
    itemId: number;
    bidderId: number;
    amount: number;
    timestamp: Date | null;
    isWinning: boolean;
    isBuyNow: boolean;
}

export const insertBidSchema = z.object({
    itemId: z.number(),
    bidderId: z.number(),
    amount: z.number().min(0, "Bid amount must be at least 0"),
    isBuyNow: z.boolean().default(false),
});

export type InsertBid = z.infer<typeof insertBidSchema>;
