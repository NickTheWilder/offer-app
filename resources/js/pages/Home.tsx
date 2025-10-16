import React, { type JSX, useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import AuctionItemCard from "@/components/AuctionItemCard";
import BidModal from "@/components/BidModal";
import BuyNowModal from "@/components/BuyNowModal";
import { AuctionItem, Bid, PageProps } from "@/types";
import styles from "./HomePage.module.css";
import MyBids from "@/components/MyBids";

interface BidWithItem extends Bid {
    auction_item: AuctionItem;
}

type HomeProps = PageProps<{
    auctionItems: AuctionItem[];
    userBids?: BidWithItem[];
}>;

export default function Home({ auth, auctionItems, userBids }: HomeProps): JSX.Element {
    const [activeTab, setActiveTab] = useState("bidderDashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [bidModalItem, setBidModalItem] = useState<AuctionItem | null>(null);
    const [buyNowModalItem, setBuyNowModalItem] = useState<AuctionItem | null>(null);

    // Redirect admin users to the admin page
    useEffect(() => {
        if (auth.user?.role === "admin") {
            router.visit("/admin");
        }
    }, [auth.user]);

    // Filter items by search query
    const filteredItems = auctionItems?.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query) || (item.category || "").toLowerCase().includes(query);
    });

    // Handle bid button click
    const handleBidClick = (item: AuctionItem) => {
        setBidModalItem(item);
    };

    // Handle buy now button click
    const handleBuyNowClick = (item: AuctionItem) => {
        setBuyNowModalItem(item);
    };

    return (
        <>
            <Head title="Auction" />
            <div className={styles.container}>
                <Header user={auth.user} />

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

                            {/* Empty state */}
                            {filteredItems?.length === 0 && (
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
                                    <p className={styles.emptyText}>{searchQuery ? "Try adjusting your search" : "Check back soon for new items"}</p>
                                </div>
                            )}

                            {/* Auction items grid */}
                            {filteredItems && filteredItems.length > 0 && <AuctionItemCard items={filteredItems} user={auth.user} onBidClick={handleBidClick} onBuyNowClick={handleBuyNowClick} />}
                        </div>
                    )}

                    {activeTab === "myBids" && <MyBids bids={userBids || []} />}
                </main>

                <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Modals */}
                {bidModalItem && <BidModal item={bidModalItem} onClose={() => setBidModalItem(null)} />}

                {buyNowModalItem && <BuyNowModal item={buyNowModalItem} onClose={() => setBuyNowModalItem(null)} />}
            </div>
        </>
    );
}
