import { type JSX, useState, FormEvent } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AuctionItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import styles from "./BidModal.module.css";

interface BidModalProps {
    item: AuctionItem;
    onClose: () => void;
}

export default function BidModal({ item, onClose }: BidModalProps): JSX.Element {
    const { toast } = useToast();

    // Calculate minimum bid amount (convert to numbers in case they're strings from Laravel)
    const currentBid = item.current_bid ? Number(item.current_bid) : null;
    const startingBid = Number(item.starting_bid);
    const increment = Number(item.minimum_bid_increment) || 5;

    const minBid = currentBid ? currentBid + increment : startingBid;

    const [bidAmount, setBidAmount] = useState<string>(minBid.toString());
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Submit handler
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validate bid amount
        const amount = parseFloat(bidAmount);

        if (isNaN(amount)) {
            setError("Please enter a valid amount");
            return;
        }

        if (amount < minBid) {
            setError(`Your bid must be at least ${formatCurrency(minBid)}`);
            return;
        }

        // Clear error
        setError("");
        setIsSubmitting(true);

        router.post(
            `/auction-items/${item.id}/bids`,
            { amount },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Bid placed successfully",
                        description: `Your bid of ${formatCurrency(amount)} has been placed.`,
                    });
                    onClose();
                },
                onError: (errors) => {
                    // Laravel validation errors come as an object with field names as keys
                    const errorMessage = (errors.amount as string) || "Failed to place bid";
                    setError(errorMessage);
                    toast({
                        title: "Bid failed",
                        description: errorMessage,
                        variant: "destructive",
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Place a Bid</h2>
                    <p className={styles.modalDescription}>Enter your bid amount for this item.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <div className={styles.itemPreview}>
                            {/* Item image */}
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

                            {/* Item details */}
                            <div className={styles.itemDetails}>
                                <h4 className={styles.itemName}>{item.name}</h4>
                                <div className={styles.itemMeta}>
                                    <span>
                                        Current bid:{" "}
                                        {item.current_bid
                                            ? formatCurrency(item.current_bid)
                                            : formatCurrency(item.starting_bid)}
                                    </span>
                                    <span className={styles.metaSeparator}>•</span>
                                    <span>Item #{item.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.bidFormGroup}>
                            <label
                                htmlFor="bidAmount"
                                className={styles.bidLabel}
                            >
                                Your Bid Amount
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.currencyPrefix}>
                                    <span>$</span>
                                </div>
                                <input
                                    type="number"
                                    id="bidAmount"
                                    className={styles.bidInput}
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    min={minBid}
                                    step="0.01"
                                />
                                <div className={styles.currencySuffix}>
                                    <span>USD</span>
                                </div>
                            </div>
                            {error && <p className={styles.errorMessage}>{error}</p>}
                            <p className={styles.bidHelp}>
                                Minimum bid is {formatCurrency(minBid)}
                                {item.current_bid ? ` (current bid + ${formatCurrency(increment)})` : ""}
                            </p>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className={styles.spinnerIcon} />
                                    Placing Bid...
                                </>
                            ) : (
                                "Place Bid"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
