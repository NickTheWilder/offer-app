import type { Bid, User } from "../types/schema";

// Mock users
export const mockUsers: User[] = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        phone: "555-1234",
        bidderNumber: "A001",
        role: "admin",
        password: "admin123", // In a real implementation, passwords would be hashed
        isActive: true,
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "Bidder User",
        email: "bidder@example.com",
        phone: "555-5678",
        bidderNumber: "B001",
        role: "bidder",
        password: "bidder123", // In a real implementation, passwords would be hashed
        isActive: true,
        createdAt: new Date(),
    },
];

// Mock bids
export const mockBids: Bid[] = [
    {
        id: 1,
        itemId: 1,
        bidderId: 2,
        amount: 55.0,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isWinning: false,
        isBuyNow: false,
    },
    {
        id: 2,
        itemId: 1,
        bidderId: 1,
        amount: 65.0,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isWinning: true,
        isBuyNow: false,
    },
    {
        id: 3,
        itemId: 2,
        bidderId: 2,
        amount: 85.0,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isWinning: true,
        isBuyNow: false,
    },
];
