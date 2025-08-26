import React, { type JSX, useState, useEffect } from "react";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import AuctionItemGrid from "@/components/auction-item-card";
import MyBids from "@/components/my-bids";
import BidModal from "@/components/bid-modal";
import BuyNowModal from "@/components/buy-now-modal";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import type { AuctionItem } from "../types/schema";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import styles from "./home-page.module.css";
import { apolloClient } from "@/lib/apollo-client";
import { AuctionStatus, GET_AUCTION_ITEMS } from "@/lib/graphql-queries";
import type { GetAuctionItemsQuery } from "@/types/generated/graphql";

export default function HomePage(): JSX.Element {
    const { user } = useAuth();
    const [, setLocation] = useLocation();

    const [activeTab, setActiveTab] = useState("bidderDashboard");
    const [selectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [bidModalItem, setBidModalItem] = useState<AuctionItem | null>(null);
    const [buyNowModalItem, setBuyNowModalItem] = useState<AuctionItem | null>(null);

    // Fetch auction items using GraphQL
    const { data: items, isLoading } = useQuery<AuctionItem[]>({
        queryKey: ["auctionItems", selectedCategory],
        queryFn: async () => {
            const { data } = await apolloClient.query<GetAuctionItemsQuery>({
                query: GET_AUCTION_ITEMS,
            });

            let filteredItems = data.auctionItems;

            // Filter by category if selected
            if (selectedCategory) {
                filteredItems = filteredItems.filter(item => item.category === selectedCategory);
            }

            // Filter by active status
            filteredItems = filteredItems.filter(item => item.status === AuctionStatus.Active);

            return filteredItems as AuctionItem[];
        },
    });

    // Filter items by search query
    const filteredItems = items?.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query) || (item.category || "").toLowerCase().includes(query);
    });

    // Redirect admin users to the admin page
    useEffect(() => {
        if (user?.role === "admin") {
            setLocation("/admin");
        }
    }, [user, setLocation]);

    // Handle bid button click
    const handleBidClick = (item: AuctionItem) => {
        setBidModalItem(item);
    };

    // Handle buy now button click
    const handleBuyNowClick = (item: AuctionItem) => {
        setBuyNowModalItem(item);
    };

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                {activeTab === "bidderDashboard" && (
                    <div className={styles.dashboardSection}>
                        {/* Top section with filtering */}
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Browse Auction Items</h2>
                            <div className={styles.filtersContainer}>
                                <div className={styles.searchContainer}>
                                    <input type="text" placeholder="Search items..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <span className={styles.searchIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.spinnerIcon} />
                            </div>
                        )}

                        {/* Empty state */}
                        {!isLoading && filteredItems?.length === 0 && (
                            <div className={styles.emptyContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                                <h3 className={styles.emptyTitle}>No auction items found</h3>
                                <p className={styles.emptyText}>{searchQuery || selectedCategory ? "Try adjusting your search or filter" : "Check back soon for new items"}</p>
                            </div>
                        )}

                        {/* Auction items grid */}
                        {!isLoading && filteredItems && filteredItems.length > 0 && <AuctionItemGrid items={filteredItems} onBidClick={handleBidClick} onBuyNowClick={handleBuyNowClick} />}
                    </div>
                )}

                {activeTab === "myBids" && <MyBids />}
            </main>

            <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Modals */}
            {bidModalItem && <BidModal item={bidModalItem} onClose={() => setBidModalItem(null)} />}

            {buyNowModalItem && <BuyNowModal item={buyNowModalItem} onClose={() => setBuyNowModalItem(null)} />}
        </div>
    );
}
