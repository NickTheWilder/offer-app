/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import styles from "./bid-modal.module.css";
import { useAuth } from "@/hooks/use-auth";

interface BidModalProps {
    item: any;
    onClose: () => void;
}

export default function BidModal({ item, onClose }: BidModalProps): JSX.Element {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [bidAmount, setBidAmount] = useState<string>("");
    const [minBid, setMinBid] = useState<number>(item.startingBid);
    const [error, setError] = useState<string>("");

    // Get current highest bid for this item using our mock API
    const { data: bids, isLoading: isLoadingBids } = useQuery({
        queryKey: [`/api/bids/item/${item.id}`],
        queryFn: async () => {
            return [];
        },
    });

    // Calculate minimum bid amount
    useEffect(() => {
        if (bids && bids.length > 0) {
            // Find highest bid
            const highestBid = bids.reduce((max: any, bid: any) => (bid.amount > max.amount ? bid : max), bids[0]);

            // Set minimum bid as highest bid + increment
            setMinBid(highestBid.amount + (item.minimumBidIncrement || 5));
        } else {
            // If no bids, use starting bid
            setMinBid(item.startingBid);
        }

        // Set initial bid amount to minimum bid
        setBidAmount(minBid.toString());
    }, [bids, item]);

    // Get the current user
    const { user } = useAuth();

    // Submit bid mutation using our mock API
    const placeBidMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("You must be logged in to place a bid");

            const bid = {
                itemId: item.id,
                bidderId: user.id,
                amount: parseFloat(bidAmount),
                isBuyNow: false,
            };

            return bid;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: [`/api/bids/item/${item.id}`] });
            queryClient.invalidateQueries({ queryKey: ["/api/bids/user"] });
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });

            // Show success toast
            toast({
                title: "Bid placed successfully",
                description: `Your bid of ${formatCurrency(parseFloat(bidAmount))} has been placed.`,
            });

            // Close the modal
            onClose();
        },
        onError: (error: any) => {
            if (error.message.includes("must be at least")) {
                setError(`Your bid must be at least ${formatCurrency(minBid)}`);
            } else {
                setError(error.message || "Failed to place bid");
            }

            toast({
                title: "Bid failed",
                description: error.message || "Failed to place bid",
                variant: "destructive",
            });
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

    // Submit handler
    const handleSubmit = () => {
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

        // Submit bid
        placeBidMutation.mutate();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Place a Bid</h2>
                    <p className={styles.modalDescription}>Enter your bid amount for this item.</p>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.itemPreview}>
                        {/* Item image */}
                        <div className={styles.imageContainer}>
                            {item.images && item.images.length > 0 ? (
                                <img src={item.images[0]} alt={item.name} className={styles.image} />
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

                        {/* Item details */}
                        <div className={styles.itemDetails}>
                            <h4 className={styles.itemName}>{item.name}</h4>
                            <div className={styles.itemMeta}>
                                <span>Current bid: {isLoadingBids ? "Loading..." : formatCurrency(minBid - (item.minimumBidIncrement || 5))}</span>
                                <span className={styles.metaSeparator}>•</span>
                                <span>Item #{item.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.bidFormGroup}>
                        <label htmlFor="bidAmount" className={styles.bidLabel}>
                            Your Bid Amount
                        </label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.currencyPrefix}>
                                <span>$</span>
                            </div>
                            <input type="number" id="bidAmount" className={styles.bidInput} value={bidAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)} min={minBid} step="0.01" />
                            <div className={styles.currencySuffix}>
                                <span>USD</span>
                            </div>
                        </div>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <p className={styles.bidHelp}>
                            Minimum bid is {formatCurrency(minBid)}
                            {minBid > item.startingBid ? ` (current bid + $${item.minimumBidIncrement || 5})` : ""}
                        </p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.submitButton} onClick={handleSubmit} disabled={placeBidMutation.isPending}>
                        {placeBidMutation.isPending ? (
                            <>
                                <Loader2 className={styles.spinnerIcon} />
                                Placing Bid...
                            </>
                        ) : (
                            "Place Bid"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
