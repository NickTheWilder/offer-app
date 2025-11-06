import { JSX } from "react";
import styles from "./AuctionItemCard.module.css";
import { formatCurrency } from "@/lib/utils";
import { UserBidStatus } from "@/lib/types";
import { AuctionItem } from "@/types";
import { Link } from "@inertiajs/react";

interface SilentItemCardFooter {
    userBidStatus: UserBidStatus | null;
    item: AuctionItem;
    onBidClick: (item: AuctionItem) => void;
    onBuyNowClick: (item: AuctionItem) => void;
}

export function SilentItemCardFooter(props: SilentItemCardFooter): JSX.Element {
    return (
        <>
            <div className={styles.bidContainer}>
                <div className={styles.bidInfo}>
                    <p className={styles.label}>Current Bid</p>
                    <p className={styles.currentBid}>
                        {formatCurrency(props.item.current_bid || props.item.starting_bid)}
                    </p>
                </div>

                <div className={styles.userBidInfo}>
                    {props.userBidStatus ? (
                        <>
                            <p className={styles.label}>Your Bid</p>
                            <p className={props.userBidStatus.isWinning ? styles.userBidWinning : styles.userBidOutbid}>
                                {formatCurrency(props.userBidStatus.amount)}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className={styles.label}>Starting Bid</p>
                            <p className={styles.startingBid}>{formatCurrency(props.item.starting_bid)}</p>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.footerContainer}>
                <div className={styles.buttonsContainer}>
                    <button
                        onClick={() => props.onBidClick(props.item)}
                        className={`${styles.bidButton} ${props.userBidStatus && !props.userBidStatus.isWinning ? styles.bidButtonOutbid : props.userBidStatus && props.userBidStatus.isWinning ? styles.bidButtonWinning : ""}`}
                    >
                        {props.userBidStatus && !props.userBidStatus.isWinning
                            ? "Bid Again"
                            : props.userBidStatus && props.userBidStatus.isWinning
                              ? "Increase Bid"
                              : "Place Bid"}
                    </button>

                    {props.item.buy_now_price && (
                        <button
                            onClick={() => props.onBuyNowClick(props.item)}
                            className={styles.buyNowButton}
                        >
                            Buy Now
                        </button>
                    )}
                </div>

                <Link
                    href={`/auction-items/${props.item.id}`}
                    className={styles.viewDetailsLink}
                >
                    View Details →
                </Link>
            </div>
        </>
    );
}
