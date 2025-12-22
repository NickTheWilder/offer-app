import { type JSX, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import AuctionItemCard from "@/components/Bidder/AuctionItemCard";
import BidModal from "@/components/Bidder/BidModal";
import BuyNowModal from "@/components/Bidder/BuyNowModal";
import { AuctionItem, Bid, PageProps } from "@/types";
import styles from "./HomePage.module.css";
import MyBids from "@/components/Bidder/MyBids";

interface BidWithItem extends Bid {
    auction_item: AuctionItem;
}

type HomeProps = PageProps<{
    auctionItems: AuctionItem[];
    userBids?: BidWithItem[];
    favoriteItemIds?: number[];
}>;

export default function Home({ auth, auctionItems, userBids, favoriteItemIds, settings }: HomeProps): JSX.Element {
    const [activeTab, setActiveTab] = useState("bidderDashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [bidModalItem, setBidModalItem] = useState<AuctionItem | null>(null);
    const [buyNowModalItem, setBuyNowModalItem] = useState<AuctionItem | null>(null);

    // Filter items by search query
    const filteredItems = useMemo(
        () =>
            auctionItems?.filter((item) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    item.name.toLowerCase().includes(query) ||
                    (item.description || "").toLowerCase().includes(query) ||
                    (item.category || "").toLowerCase().includes(query)
                );
            }),
        [auctionItems, searchQuery]
    );

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
                                <div className={styles.titleRow}>
                                    <h2 className={styles.sectionTitle}>Browse Auction Items</h2>
                                    {settings.auction_end && (
                                        <div className={styles.timeLeft}>
                                            <span className={styles.timeLabel}>Time Left:</span>
                                            <span className={styles.timeValue}>
                                                {new Date(settings.auction_end) > new Date()
                                                    ? (() => {
                                                          const diff =
                                                              new Date(settings.auction_end).getTime() -
                                                              new Date().getTime();
                                                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                                          const hours = Math.floor(
                                                              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                                                          );
                                                          const minutes = Math.floor(
                                                              (diff % (1000 * 60 * 60)) / (1000 * 60)
                                                          );
                                                          return days > 0
                                                              ? `${days}d ${hours}h`
                                                              : hours > 0
                                                                ? `${hours}h ${minutes}m`
                                                                : `${minutes}m`;
                                                      })()
                                                    : "Ended"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.filtersContainer}>
                                    <div className={styles.searchContainer}>
                                        <input
                                            type="text"
                                            placeholder="Search items..."
                                            className={styles.searchInput}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <span className={styles.searchIcon}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Empty state */}
                            {filteredItems?.length === 0 && (
                                <div className={styles.emptyContainer}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={styles.emptyIcon}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                    <h3 className={styles.emptyTitle}>No auction items found</h3>
                                    <p className={styles.emptyText}>
                                        {searchQuery ? "Try adjusting your search" : "Check back soon for new items"}
                                    </p>
                                </div>
                            )}

                            {/* Auction items grid */}
                            {filteredItems && filteredItems.length > 0 && (
                                <AuctionItemCard
                                    items={filteredItems}
                                    user={auth.user}
                                    userBids={(userBids || []) as Bid[]}
                                    favoriteItemIds={favoriteItemIds || []}
                                    onBidClick={handleBidClick}
                                    onBuyNowClick={handleBuyNowClick}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "myBids" && <MyBids bids={userBids || []} />}
                </main>

                <MobileNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Modals */}
                {bidModalItem && (
                    <BidModal
                        item={bidModalItem}
                        onClose={() => setBidModalItem(null)}
                    />
                )}

                {buyNowModalItem && (
                    <BuyNowModal
                        item={buyNowModalItem}
                        onClose={() => setBuyNowModalItem(null)}
                    />
                )}
            </div>
        </>
    );
}
