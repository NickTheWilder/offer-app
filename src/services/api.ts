import type { User, InsertUser, AuctionItem, InsertAuctionItem, Bid, InsertBid } from "../types/schema";
import { mockBids, mockUsers } from "./mockData";
import * as GraphQLAPI from "./graphql-api";

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

// Local storage for bids (allows modifications during the session)
let bids = [...mockBids];

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

// ===== Auction Items API =====

export async function getAuctionItems(filter?: { category?: string; status?: string }): Promise<AuctionItem[]> {
    return await GraphQLAPI.getAuctionItems(filter);
}

export async function getAuctionItem(id: number): Promise<AuctionItem | null> {
    return await GraphQLAPI.getAuctionItem(id);
}

export async function createAuctionItem(itemData: InsertAuctionItem): Promise<AuctionItem> {
    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await GraphQLAPI.createAuctionItem(itemData);
}

export async function updateAuctionItem(id: number, itemData: Partial<AuctionItem>): Promise<AuctionItem> {
    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await GraphQLAPI.updateAuctionItem(id, itemData);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO: Implement deleteAuctionItem
export async function deleteAuctionItem(id: number): Promise<boolean> {
    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await GraphQLAPI.deleteAuctionItem();
}

export async function getItemCategories(): Promise<string[]> {
    return await GraphQLAPI.getItemCategories();
}

// ===== Bids API =====

export async function getBidsByItem(itemId: number): Promise<Bid[]> {
    await simulateDelay();
    return bids.filter((bid) => bid.itemId === itemId);
}

export async function getBidsByUser(userId: number): Promise<(Bid & { item: AuctionItem })[]> {
    await simulateDelay();

    if (!currentUser) {
        throw new Error("Unauthorized");
    }

    // Only return bids for the current user or if admin
    if (currentUser.role !== "admin" && currentUser.id !== userId) {
        throw new Error("Unauthorized");
    }

    const userBids = bids.filter((bid) => bid.bidderId === userId);

    // Attach item data to each bid
    const bidsWithItems = await Promise.all(
        userBids.map(async (bid) => {
            const item = await GraphQLAPI.getAuctionItem(bid.itemId);
            if (!item) {
                throw new Error(`Item with ID ${bid.itemId} not found`);
            }
            return { ...bid, item };
        })
    );

    return bidsWithItems;
}

export async function getCurrentWinningBid(itemId: number): Promise<Bid | null> {
    await simulateDelay();

    const itemBids = bids.filter((bid) => bid.itemId === itemId);
    if (itemBids.length === 0) {
        return null;
    }

    // Find the highest bid
    return itemBids.reduce((prev, current) => (prev.amount > current.amount ? prev : current));
}

export async function createBid(bidData: InsertBid): Promise<Bid> {
    await simulateDelay();

    if (!currentUser) {
        throw new Error("Unauthorized");
    }

    // Check if the item exists
    const item = await GraphQLAPI.getAuctionItem(bidData.itemId);
    if (!item) {
        throw new Error("Item not found");
    }

    // Check if item is available for bidding
    if (item.status !== "active" && item.status !== "published") {
        throw new Error("Item is not available for bidding");
    }

    // Check if this is a buy now bid
    if (bidData.isBuyNow) {
        if (!item.buyNowPrice) {
            throw new Error("This item does not have a buy now option");
        }

        if (bidData.amount !== item.buyNowPrice) {
            throw new Error("Buy now amount must match the buy now price");
        }
    } else {
        // Get current highest bid
        const currentHighestBid = await getCurrentWinningBid(bidData.itemId);
        const minBid = currentHighestBid ? currentHighestBid.amount + (item.minimumBidIncrement || 5) : item.startingBid;

        // Verify bid amount is valid
        if (bidData.amount < minBid) {
            throw new Error(`Bid amount must be at least ${minBid}`);
        }
    }

    // Create the new bid
    const newBid: Bid = {
        id: bids.length + 1,
        itemId: bidData.itemId,
        bidderId: bidData.bidderId,
        amount: bidData.amount,
        timestamp: new Date(),
        isWinning: false, // Will be set to true below
        isBuyNow: bidData.isBuyNow || false,
    };

    // Update all existing bids to not be winning
    bids = bids.map((bid) => {
        if (bid.itemId === bidData.itemId) {
            return { ...bid, isWinning: false };
        }
        return bid;
    });

    // Set the new bid as winning
    newBid.isWinning = true;
    bids.push(newBid);

    // If this is the first bid and item is in published state, update to active
    if (item.status === "published") {
        await GraphQLAPI.updateAuctionItem(item.id, { status: "active" });
    }

    // If this is a buy now bid, mark the item as sold
    if (bidData.isBuyNow) {
        await GraphQLAPI.updateAuctionItem(item.id, { status: "sold" });
    }

    return newBid;
}

// ===== Demo Data API =====

export async function seedDemoData(): Promise<{ message: string }> {
    await simulateDelay();

    // Reset bids to initial state
    bids = [...mockBids];

    return { message: "Bid demo data initialized successfully" };
}
