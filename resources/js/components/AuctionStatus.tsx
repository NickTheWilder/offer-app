import { type JSX } from "react";
import { Clock } from "lucide-react";
import styles from "./AuctionStatus.module.css";

interface AuctionStatusProps {
    auctionStart: string | null;
    auctionEnd: string | null;
}

export function AuctionStatus({ auctionStart, auctionEnd }: AuctionStatusProps): JSX.Element | null {
    // If no times are set, don't show anything
    if (!auctionStart && !auctionEnd) {
        return null;
    }

    const now = new Date();
    const startDate = auctionStart ? new Date(auctionStart) : null;
    const endDate = auctionEnd ? new Date(auctionEnd) : null;

    const isBeforeStart = startDate && now < startDate;
    const isAfterEnd = endDate && now > endDate;
    const isActive = !isBeforeStart && !isAfterEnd;

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className={`${styles.statusBanner} ${isActive ? styles.active : styles.inactive}`}>
            <div className={styles.statusContent}>
                <Clock className={styles.icon} />
                <div className={styles.statusText}>
                    {isBeforeStart && startDate && (
                        <div>
                            <span className={styles.statusLabel}>Auction opens:</span>
                            <span className={styles.statusTime}>{formatDate(startDate)}</span>
                        </div>
                    )}
                    {isActive && (
                        <div>
                            <span className={styles.statusLabel}>Auction is open</span>
                            {endDate && (
                                <>
                                    <span className={styles.separator}>•</span>
                                    <span className={styles.statusLabel}>Closes:</span>
                                    <span className={styles.statusTime}>{formatDate(endDate)}</span>
                                </>
                            )}
                        </div>
                    )}
                    {isAfterEnd && endDate && (
                        <div>
                            <span className={styles.statusLabel}>Auction closed:</span>
                            <span className={styles.statusTime}>{formatDate(endDate)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function isAuctionActive(auctionStart: string | null, auctionEnd: string | null): boolean {
    const now = new Date();
    const startDate = auctionStart ? new Date(auctionStart) : null;
    const endDate = auctionEnd ? new Date(auctionEnd) : null;

    const isBeforeStart = startDate && now < startDate;
    const isAfterEnd = endDate && now > endDate;

    return !isBeforeStart && !isAfterEnd;
}
