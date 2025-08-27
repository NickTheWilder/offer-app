import type { User } from "../types/schema";

// Mock users
export const mockUsers: User[] = [
    {
        id: "1",
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
        id: "2",
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
