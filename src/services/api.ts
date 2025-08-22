import type { User, InsertUser, } from "../types/schema";
import { mockBids, mockUsers } from "./mockData";

/**
 * API SERVICE
 *
 * This file provides API implementations for the application.
 * Auction items use GraphQL API, while authentication still uses mock data.
 */

// Simulate network delay to make the app feel realistic
const MOCK_DELAY = 300;
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

// Store session in localStorage to persist across refreshes
let currentUser: User | null = null;
const SESSION_KEY = "mock_session_user";

// Initialize from localStorage if available
try {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
        currentUser = JSON.parse(savedSession);
    }
} catch (e) {
    console.error("Failed to load session from localStorage", e);
}

// ===== Authentication API =====

export async function loginUser(email: string, password: string): Promise<User> {
    await simulateDelay();

    const user = mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
    }

    currentUser = { ...user };

    // Save to localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

    return currentUser;
}

export async function registerUser(userData: InsertUser): Promise<User> {
    await simulateDelay();

    // Check if email already exists
    if (mockUsers.some((u) => u.email === userData.email)) {
        throw new Error("Email already exists");
    }

    // Check if bidder number already exists
    if (mockUsers.some((u) => u.bidderNumber === userData.bidderNumber)) {
        throw new Error("Bidder number already exists");
    }

    // Create new user with an ID
    const newUser: User = {
        id: mockUsers.length + 1,
        ...userData,
        role: userData.role || "bidder", // Ensure role is set
        isActive: true,
        createdAt: new Date(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;

    // Save to localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

    return currentUser;
}

export async function logoutUser(): Promise<void> {
    await simulateDelay();
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
    await simulateDelay();
    return currentUser;
}

// ===== Demo Data API =====

export async function seedDemoData(): Promise<{ message: string }> {
    await simulateDelay();

    return { message: "Bid demo data initialized successfully" };
}
