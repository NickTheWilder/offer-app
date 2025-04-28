import type { User, InsertUser, AuctionItem, InsertAuctionItem, Bid, InsertBid } from "shared/schema";
import { mockAuctionItems, mockBids, mockUsers, getCategories } from "./mockData";

/**
 * MOCK API SERVICE
 *
 * This file provides mock implementations of all the API endpoints used in the application.
 * In a real application, these functions would make actual HTTP requests to a backend server.
 *
 * When connecting to a real backend:
 * 1. Replace each function with actual fetch/axios calls to your API endpoints
 * 2. Ensure proper error handling and authentication
 * 3. Update the return types to match your actual API responses
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

// Local storage for items and bids (allows modifications during the session)
let items = [...mockAuctionItems];
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
    await simulateDelay();

    let filteredItems = [...items];

    if (filter?.category) {
        filteredItems = filteredItems.filter((item) => item.category === filter.category);
    }

    if (filter?.status) {
        filteredItems = filteredItems.filter((item) => item.status === filter.status);
    }

    return filteredItems;
}

export async function getAuctionItem(id: number): Promise<AuctionItem | null> {
    await simulateDelay();
    return items.find((item) => item.id === id) || null;
}

export async function createAuctionItem(itemData: InsertAuctionItem): Promise<AuctionItem> {
    await simulateDelay();

    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Ensure all required fields have values
    const newItem: AuctionItem = {
        id: items.length + 1,
        name: itemData.name,
        description: itemData.description || null,
        images: itemData.images || null,
        startingBid: itemData.startingBid,
        minimumBidIncrement: itemData.minimumBidIncrement || 5,
        buyNowPrice: itemData.buyNowPrice || null,
        estimatedValue: itemData.estimatedValue || null,
        category: itemData.category,
        tags: itemData.tags || null,
        auctionType: itemData.auctionType || "silent",
        displayOrder: itemData.displayOrder || 0,
        donorName: itemData.donorName || null,
        donorPublic: itemData.donorPublic || false,
        status: itemData.status || "draft",
        restrictions: itemData.restrictions || null,
        additionalDetails: itemData.additionalDetails || null,
        startTime: itemData.startTime || null,
        endTime: itemData.endTime || null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    items.push(newItem);
    return newItem;
}

export async function updateAuctionItem(id: number, itemData: Partial<AuctionItem>): Promise<AuctionItem> {
    await simulateDelay();

    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
        throw new Error("Item not found");
    }

    const updatedItem = {
        ...items[index],
        ...itemData,
        updatedAt: new Date(),
    };

    items[index] = updatedItem;
    return updatedItem;
}

export async function deleteAuctionItem(id: number): Promise<boolean> {
    await simulateDelay();

    if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }

    items.splice(index, 1);
    return true;
}

export async function getItemCategories(): Promise<string[]> {
    await simulateDelay();
    return getCategories();
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
    return userBids.map((bid) => {
        const item = items.find((item) => item.id === bid.itemId);
        if (!item) {
            throw new Error(`Item with ID ${bid.itemId} not found`);
        }
        return { ...bid, item };
    });
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
    const item = items.find((item) => item.id === bidData.itemId);
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
        const itemIndex = items.findIndex((i) => i.id === item.id);
        items[itemIndex] = { ...items[itemIndex], status: "active" };
    }

    // If this is a buy now bid, mark the item as sold
    if (bidData.isBuyNow) {
        const itemIndex = items.findIndex((i) => i.id === item.id);
        items[itemIndex] = { ...items[itemIndex], status: "sold" };
    }

    return newBid;
}

// ===== Demo Data API =====

export async function seedDemoData(): Promise<{ message: string }> {
    await simulateDelay();

    // Reset items and bids to initial state
    items = [...mockAuctionItems];
    bids = [...mockBids];

    return { message: "Demo data initialized successfully" };
}
