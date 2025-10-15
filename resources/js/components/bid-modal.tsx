import React, { type JSX, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import styles from "./bid-modal.module.css";
import type { AuctionItem } from '@/types';

interface BidModalProps {
    item: AuctionItem;
    onClose: () => void;
}

export default function BidModal({ item, onClose }: BidModalProps): JSX.Element {
    const { toast } = useToast();
    const [bidAmount, setBidAmount] = useState<string>("");
    const [minBid, setMinBid] = useState<number>(item.starting_bid);
    const [error, setError] = useState<string>("");

    const { setData, post, processing, reset } = useForm({
        auction_item_id: item.id,
        amount: 0,
    });

    // Calculate minimum bid amount
    useEffect(() => {
        const currentBid = item.current_bid || item.starting_bid;
        const minimumIncrement = 5; // Could be a prop or config
        setMinBid(currentBid + minimumIncrement);
        setBidAmount((currentBid + minimumIncrement).toString());
    }, [item]);

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
        setData('amount', amount);
        post('/bids', {
            onSuccess: () => {
                toast({
                    title: "Bid placed successfully",
                    description: `Your bid of ${formatCurrency(amount)} has been placed.`,
                });
                reset();
                onClose();
            },
            onError: (errors) => {
                const errorMessage = errors.amount || 'Failed to place bid';
                setError(errorMessage);
                toast({
                    title: "Bid failed",
                    description: errorMessage,
                    variant: "destructive",
                });
            },
        });
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
                            {item.files && item.files.length > 0 ? (
                                <img src={item.files[0]?.url} alt={item.name} className={styles.image} />
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
                                <span>Current bid: {formatCurrency(item.current_bid || item.starting_bid)}</span>
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
                        </p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.submitButton} onClick={handleSubmit} disabled={processing}>
                        {processing ? (
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
