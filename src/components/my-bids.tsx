import type { JSX } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import styles from "./my-bids.module.css";

interface BidWithItem {
    id: number;
    itemId: number;
    bidderId: number;
    amount: number;
    timestamp: string;
    isWinning: boolean;
    item: {
        id: number;
        name: string;
        images: string[];
        // TODO: fix
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

export default function MyBids(): JSX.Element {
    // Fetch user's bids
    const {
        data: bids,
        isLoading,
        error,
    } = useQuery<BidWithItem[]>({
        queryKey: ["/api/bids/user"],
        queryFn: async () => {
            const res = await fetch("/api/bids/user");
            if (!res.ok) throw new Error("Failed to fetch your bids");
            return res.json();
        },
    });

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(date);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className={styles.errorTitle}>Error Loading Bids</h3>
                    <p className={styles.errorMessage}>{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!bids || bids.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>My Bids</h2>

                <div className={styles.emptyContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <h3 className={styles.emptyTitle}>No bids yet</h3>
                    <p className={styles.emptyText}>You haven't placed any bids on auction items.</p>
                    <button onClick={() => (window.location.href = "/")} className={styles.browseButton}>
                        Browse Items
                    </button>
                </div>
            </div>
        );
    }

    // Group bids by item (get only highest bid per item)
    const groupedBids: Record<number, BidWithItem> = {};
    bids.forEach((bid) => {
        const existingBid = groupedBids[bid.itemId];
        if (!existingBid || bid.amount > existingBid.amount) {
            groupedBids[bid.itemId] = bid;
        }
    });

    const highestBids = Object.values(groupedBids);
    const winningBids = highestBids.filter((bid) => bid.isWinning);
    const outbidBids = highestBids.filter((bid) => !bid.isWinning);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>My Bids</h2>

            <div className={styles.bidsGrid}>
                {/* Winning bids */}
                {winningBids.map((bid) => (
                    <div key={bid.id} className={`${styles.bidCard} ${styles.winningCard}`}>
                        <div className={`${styles.statusBadge} ${styles.winningBadge}`}>Winning</div>
                        <div className={styles.itemHeader}>
                            <div className={styles.imageContainer}>
                                {bid.item.images && bid.item.images.length > 0 ? (
                                    <img src={bid.item.images[0]} alt={bid.item.name} className={styles.image} />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.placeholderIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{bid.item.name}</h3>
                                <p className={styles.itemId}>#{bid.item.id}</p>
                            </div>
                        </div>
                        <div className={styles.bidInfo}>
                            <div>
                                <p className={styles.bidLabel}>Your Bid</p>
                                <p className={`${styles.bidAmount} ${styles.winningAmount}`}>{formatCurrency(bid.amount)}</p>
                            </div>
                            <div>
                                <p className={styles.bidLabel}>Bid Time</p>
                                <p className={styles.bidTimestamp}>{formatDate(bid.timestamp)}</p>
                            </div>
                        </div>
                        <div className={styles.bidActions}>
                            <a href="/" className={styles.viewItemLink}>
                                View Item
                            </a>
                        </div>
                    </div>
                ))}

                {/* Outbid bids */}
                {outbidBids.map((bid) => (
                    <div key={bid.id} className={`${styles.bidCard} ${styles.outbidCard}`}>
                        <div className={`${styles.statusBadge} ${styles.outbidBadge}`}>Outbid</div>
                        <div className={styles.itemHeader}>
                            <div className={styles.imageContainer}>
                                {bid.item.images && bid.item.images.length > 0 ? (
                                    <img src={bid.item.images[0]} alt={bid.item.name} className={styles.image} />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.placeholderIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{bid.item.name}</h3>
                                <p className={styles.itemId}>#{bid.item.id}</p>
                            </div>
                        </div>
                        <div className={styles.bidInfo}>
                            <div>
                                <p className={styles.bidLabel}>Your Bid</p>
                                <p className={`${styles.bidAmount} ${styles.outbidAmount}`}>{formatCurrency(bid.amount)}</p>
                            </div>
                            <div>
                                <p className={styles.bidLabel}>Bid Time</p>
                                <p className={styles.bidTimestamp}>{formatDate(bid.timestamp)}</p>
                            </div>
                        </div>
                        <div className={styles.bidActions}>
                            <a href="/" className={styles.viewItemLink}>
                                View Item
                            </a>
                            <button className={styles.bidAgainButton}>Bid Again</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
