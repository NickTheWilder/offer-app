import { type JSX, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/components/Header";
import BidModal from "@/components/BidModal";
import BuyNowModal from "@/components/BuyNowModal";
import { AuctionItem, PageProps } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./AuctionItemDetail.module.css";

type AuctionItemDetailProps = PageProps<{
    item: AuctionItem;
}>;

export default function AuctionItemDetail({ auth, item }: AuctionItemDetailProps): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidModalOpen, setBidModalOpen] = useState(false);
    const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);

    const images = item.files || [];
    const hasMultipleImages = images.length > 1;

    // Determine user's bid status
    const userBids = item.bids?.filter((bid) => bid.user_id === auth.user?.id) || [];
    const hasUserBid = userBids.length > 0;
    const userHighestBid = hasUserBid
        ? userBids.reduce((prev, current) => (Number(prev.amount) > Number(current.amount) ? prev : current))
        : null;
    const isWinning = userHighestBid && Number(userHighestBid.amount) === Number(item.current_bid);
    const badgeType = hasUserBid ? (isWinning ? "winning" : "outbid") : "active";

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <Head title={item.name} />
            <div className={styles.container}>
                <Header user={auth.user} />

                <main className={styles.main}>
                    {/* Back button */}
                    <Link href="/" className={styles.backButton}>
                        <ChevronLeft size={20} />
                        Back to Auction
                    </Link>

                    <div className={styles.contentWrapper}>
                        {/* Left column - Image gallery */}
                        <div className={styles.leftColumn}>
                            <div className={styles.imageGallery}>
                                {images.length > 0 ? (
                                    <>
                                        <img
                                            src={images[currentImageIndex].url}
                                            alt={item.name}
                                            className={styles.mainImage}
                                        />
                                        {hasMultipleImages && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className={`${styles.navButton} ${styles.navButtonLeft}`}
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className={`${styles.navButton} ${styles.navButtonRight}`}
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                                <div className={styles.imageCounter}>
                                                    {currentImageIndex + 1} / {images.length}
                                                </div>
                                            </>
                                        )}
                                    </>
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

                                {/* Thumbnail strip */}
                                {hasMultipleImages && (
                                    <div className={styles.thumbnailStrip}>
                                        {images.map((file, index) => (
                                            <button
                                                key={file.id}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`${styles.thumbnail} ${
                                                    index === currentImageIndex ? styles.thumbnailActive : ""
                                                }`}
                                            >
                                                <img src={file.url} alt={`${item.name} ${index + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => setBidModalOpen(true)}
                                    className={`${styles.bidButton} ${
                                        hasUserBid && !isWinning
                                            ? styles.bidButtonOutbid
                                            : hasUserBid && isWinning
                                              ? styles.bidButtonWinning
                                              : ""
                                    }`}
                                >
                                    {hasUserBid && !isWinning ? "Bid Again" : hasUserBid && isWinning ? "Increase Bid" : "Place Bid"}
                                </button>

                                {item.buy_now_price && (
                                    <button onClick={() => setBuyNowModalOpen(true)} className={styles.buyNowButton}>
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right column - Item details */}
                        <div className={styles.rightColumn}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <h1 className={styles.itemName}>{item.name}</h1>
                                    <span className={styles.itemNumber}>Item #{item.id}</span>
                                </div>
                                {/* Status badge */}
                                <div
                                    className={`${styles.statusBadge} ${
                                        badgeType === "winning"
                                            ? styles.winningBadge
                                            : badgeType === "outbid"
                                              ? styles.outbidBadge
                                              : styles.activeBadge
                                    }`}
                                >
                                    {badgeType === "winning" ? "Winning" : badgeType === "outbid" ? "Outbid" : "Active"}
                                </div>
                            </div>

                            {/* Bidding info */}
                            <div className={styles.biddingSection}>
                                <div className={styles.bidInfo}>
                                    <span className={styles.bidLabel}>Current Bid</span>
                                    <span className={styles.currentBid}>
                                        {formatCurrency(item.current_bid || item.starting_bid)}
                                    </span>
                                </div>

                                {userHighestBid && (
                                    <div className={styles.bidInfo}>
                                        <span className={styles.bidLabel}>Your Bid</span>
                                        <span className={isWinning ? styles.userBidWinning : styles.userBidOutbid}>
                                            {formatCurrency(Number(userHighestBid.amount))}
                                        </span>
                                    </div>
                                )}

                                {item.buy_now_price && (
                                    <div className={styles.buyNowInfo}>
                                        <span className={styles.bidLabel}>Buy Now Price</span>
                                        <span className={styles.buyNowPrice}>{formatCurrency(item.buy_now_price)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {item.description && (
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Description</h2>
                                    <p className={styles.description}>{item.description}</p>
                                </div>
                            )}

                            {/* Donor */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Donor</h2>
                                <p className={styles.donorName}>
                                    {item.is_donor_public ? item.donor?.name || item.donor_name || "Unknown" : "Anonymous"}
                                </p>
                            </div>

                            {/* Restrictions */}
                            {item.restrictions && (
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Restrictions</h2>
                                    <p className={styles.restrictions}>{item.restrictions}</p>
                                </div>
                            )}

                            {/* Estimated Value */}
                            {item.estimated_value && (
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Estimated Value</h2>
                                    <p className={styles.estimatedValue}>{formatCurrency(item.estimated_value)}</p>
                                </div>
                            )}

                            {/* Bid History */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Bid History</h2>
                                {item.bids && item.bids.length > 0 ? (
                                    <div className={styles.bidHistory}>
                                        <table className={styles.bidTable}>
                                            <thead>
                                                <tr>
                                                    <th>Bidder</th>
                                                    <th>Amount</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.bids
                                                    .sort((a, b) => {
                                                        // Sort by amount desc, then by time asc (earlier wins)
                                                        if (b.amount !== a.amount) {
                                                            return Number(b.amount) - Number(a.amount);
                                                        }
                                                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                                                    })
                                                    .map((bid) => (
                                                        <tr key={bid.id}>
                                                            <td>
                                                                {bid.user?.bidder_number
                                                                    ? `Bidder #${bid.user.bidder_number}`
                                                                    : bid.user?.name || "Anonymous"}
                                                            </td>
                                                            <td className={styles.bidAmount}>{formatCurrency(Number(bid.amount))}</td>
                                                            <td className={styles.bidTime}>
                                                                {new Date(bid.created_at).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className={styles.noBids}>No bids yet. Be the first to bid!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modals */}
                {bidModalOpen && <BidModal item={item} onClose={() => setBidModalOpen(false)} />}
                {buyNowModalOpen && <BuyNowModal item={item} onClose={() => setBuyNowModalOpen(false)} />}
            </div>
        </>
    );
}
