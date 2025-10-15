import React, { type JSX } from 'react';
import { Link } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import styles from "./my-bids.module.css";
import type { Bid, AuctionItem } from '@/types';

interface BidWithItem extends Bid {
    auction_item: AuctionItem;
}

interface MyBidsProps {
    bids: BidWithItem[];
    isLoading?: boolean;
}

export default function MyBids({ bids, isLoading = false }: MyBidsProps): JSX.Element {
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
                    <p className={styles.emptyText}>You haven&apos;t placed any bids on auction items.</p>
                    <Link href="/" className={styles.browseButton}>
                        Browse Items
                    </Link>
                </div>
            </div>
        );
    }

    // Group bids by item (get only highest bid per item)
    const groupedBids: Record<number, BidWithItem> = {};
    bids.forEach((bid) => {
        const existingBid = groupedBids[bid.auction_item_id];
        if (!existingBid || bid.amount > existingBid.amount) {
            groupedBids[bid.auction_item_id] = bid;
        }
    });

    const highestBids = Object.values(groupedBids);
    // Determine winning vs outbid based on current bid
    const winningBids = highestBids.filter((bid) => bid.auction_item.current_bid === bid.amount);
    const outbidBids = highestBids.filter((bid) => bid.auction_item.current_bid !== bid.amount);

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
                                {bid.auction_item.files && bid.auction_item.files.length > 0 ? (
                                    <img src={bid.auction_item.files[0]?.url} alt={bid.auction_item.name} className={styles.image} />
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
                                <h3 className={styles.itemName}>{bid.auction_item.name}</h3>
                                <p className={styles.itemId}>#{bid.auction_item.id}</p>
                            </div>
                        </div>
                        <div className={styles.bidInfo}>
                            <div>
                                <p className={styles.bidLabel}>Your Bid</p>
                                <p className={`${styles.bidAmount} ${styles.winningAmount}`}>{formatCurrency(bid.amount)}</p>
                            </div>
                            <div>
                                <p className={styles.bidLabel}>Bid Time</p>
                                <p className={styles.bidTimestamp}>{formatDate(bid.created_at)}</p>
                            </div>
                        </div>
                        <div className={styles.bidActions}>
                            <Link href="/" className={styles.viewItemLink}>
                                View Item
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Outbid bids */}
                {outbidBids.map((bid) => (
                    <div key={bid.id} className={`${styles.bidCard} ${styles.outbidCard}`}>
                        <div className={`${styles.statusBadge} ${styles.outbidBadge}`}>Outbid</div>
                        <div className={styles.itemHeader}>
                            <div className={styles.imageContainer}>
                                {bid.auction_item.files && bid.auction_item.files.length > 0 ? (
                                    <img src={bid.auction_item.files[0]?.url} alt={bid.auction_item.name} className={styles.image} />
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
                                <h3 className={styles.itemName}>{bid.auction_item.name}</h3>
                                <p className={styles.itemId}>#{bid.auction_item.id}</p>
                            </div>
                        </div>
                        <div className={styles.bidInfo}>
                            <div>
                                <p className={styles.bidLabel}>Your Bid</p>
                                <p className={`${styles.bidAmount} ${styles.outbidAmount}`}>{formatCurrency(bid.amount)}</p>
                            </div>
                            <div>
                                <p className={styles.bidLabel}>Bid Time</p>
                                <p className={styles.bidTimestamp}>{formatDate(bid.created_at)}</p>
                            </div>
                        </div>
                        <div className={styles.bidActions}>
                            <Link href="/" className={styles.viewItemLink}>
                                View Item
                            </Link>
                            <button className={styles.bidAgainButton}>Bid Again</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
