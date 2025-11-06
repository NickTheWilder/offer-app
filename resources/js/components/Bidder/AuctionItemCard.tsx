import { formatCurrency } from "@/lib/utils";
import { AuctionItem, Bid, User } from "@/types";
import { type JSX } from "react";
import { Link } from "@inertiajs/react";
import styles from "./AuctionItemCard.module.css";

interface UserBidStatus {
    amount: number;
    isWinning: boolean;
}

interface AuctionItemCardProps {
    items: AuctionItem[];
    user: User | null;
    userBids: Bid[];
    onBidClick: (item: AuctionItem) => void;
    onBuyNowClick: (item: AuctionItem) => void;
}

export default function AuctionItemCard({
    items,
    userBids,
    onBidClick,
    onBuyNowClick,
}: AuctionItemCardProps): JSX.Element {
    // Determine if user is winning or has been outbid for each item
    const getUserBidStatus = (itemId: number): UserBidStatus | null => {
        if (!userBids || userBids.length === 0) return null;

        const userBidsOnItem = userBids.filter((bid) => bid.auction_item_id === itemId);
        if (userBidsOnItem.length === 0) return null;

        const highestUserBid = userBidsOnItem.reduce((prev, current) => {
            return prev.amount > current.amount ? prev : current;
        });

        // Check if this is the highest bid on the item
        const item = items.find((i) => i.id === itemId);
        const isWinning = item?.current_bid === highestUserBid.amount;

        return {
            amount: highestUserBid.amount,
            isWinning: isWinning || false,
        };
    };

    return (
        <div className={styles.gridContainer}>
            {items.map((item) => {
                const userBidStatus = getUserBidStatus(item.id);
                const badgeType = userBidStatus ? (userBidStatus.isWinning ? "winning" : "outbid") : "active";

                return (
                    <div
                        key={item.id}
                        className={styles.card}
                    >
                        {/* Status badge */}
                        <div
                            className={`${styles.statusBadge} ${badgeType === "winning" ? styles.winningBadge : badgeType === "outbid" ? styles.outbidBadge : styles.activeBadge}`}
                        >
                            {badgeType === "winning" ? "Winning" : badgeType === "outbid" ? "Outbid" : "Active"}
                        </div>

                        {/* Item image or placeholder */}
                        <div className={styles.imageContainer}>
                            {item.files && item.files.length > 0 ? (
                                <img
                                    src={item.files[0].url}
                                    alt={item.name}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={styles.placeholderIcon}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
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

                        <div className={styles.cardContent}>
                            <div className={styles.header}>
                                <h3 className={styles.title}>{item.name}</h3>
                                <span className={styles.itemId}>#{item.id}</span>
                            </div>

                            <p className={styles.description}>{item.description || "No description provided."}</p>
                            <div className={styles.donorInfo}>
                                <p className={styles.label}>
                                    Donated by:{" "}
                                    <span className={styles.donorValue}>
                                        {item.is_donor_public
                                            ? item.donor?.name || item.donor_name || "Unknown"
                                            : "Anonymous"}
                                    </span>
                                </p>
                            </div>

                            <div className={styles.auctionTypeContainer}>
                                <span
                                    className={`${styles.auctionTypeBadge} ${
                                        item.auction_type === "live"
                                            ? styles.liveAuctionBadge
                                            : styles.silentAuctionBadge
                                    }`}
                                >
                                    {item.auction_type === "live" ? "Live Auction" : "Silent Auction"}
                                </span>
                            </div>

                            <div className={styles.bidContainer}>
                                <div className={styles.bidInfo}>
                                    <p className={styles.label}>Current Bid</p>
                                    <p className={styles.currentBid}>
                                        {formatCurrency(item.current_bid || item.starting_bid)}
                                    </p>
                                </div>

                                <div className={styles.userBidInfo}>
                                    {userBidStatus ? (
                                        <>
                                            <p className={styles.label}>Your Bid</p>
                                            <p
                                                className={
                                                    userBidStatus.isWinning
                                                        ? styles.userBidWinning
                                                        : styles.userBidOutbid
                                                }
                                            >
                                                {formatCurrency(userBidStatus.amount)}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={styles.label}>Starting Bid</p>
                                            <p className={styles.startingBid}>{formatCurrency(item.starting_bid)}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.footerContainer}>
                                <div className={styles.buttonsContainer}>
                                    <button
                                        onClick={() => onBidClick(item)}
                                        className={`${styles.bidButton} ${userBidStatus && !userBidStatus.isWinning ? styles.bidButtonOutbid : userBidStatus && userBidStatus.isWinning ? styles.bidButtonWinning : ""}`}
                                    >
                                        {userBidStatus && !userBidStatus.isWinning
                                            ? "Bid Again"
                                            : userBidStatus && userBidStatus.isWinning
                                              ? "Increase Bid"
                                              : "Place Bid"}
                                    </button>

                                    {item.buy_now_price && (
                                        <button
                                            onClick={() => onBuyNowClick(item)}
                                            className={styles.buyNowButton}
                                        >
                                            Buy Now
                                        </button>
                                    )}
                                </div>

                                <Link
                                    href={`/auction-items/${item.id}`}
                                    className={styles.viewDetailsLink}
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
