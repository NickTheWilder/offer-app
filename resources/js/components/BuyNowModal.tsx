import { type JSX } from "react";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart } from "lucide-react";
import styles from "./BuyNowModal.module.css";
import type { AuctionItem } from "@/types";

interface BuyNowModalProps {
    item: AuctionItem;
    onClose: () => void;
}

export default function BuyNowModal({ item, onClose }: BuyNowModalProps): JSX.Element {
    const { toast } = useToast();

    const { post, processing } = useForm({
        auction_item_id: item.id,
        amount: item.buy_now_price || 0,
        is_buy_now: true,
    });

    // Format currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const handleConfirm = () => {
        post("/bids", {
            onSuccess: () => {
                toast({
                    title: "Purchase successful",
                    description: `You have successfully purchased ${item.name} for ${formatCurrency(item.buy_now_price)}.`,
                });
                onClose();
            },
            onError: (errors) => {
                toast({
                    title: "Purchase failed",
                    description: errors.amount || "Failed to complete purchase",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Buy Now Confirmation</h2>
                    <p className={styles.modalDescription}>Confirm your purchase of this item at the buy now price.</p>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.itemPreview}>
                        <div className={styles.iconContainer}>
                            <ShoppingCart className={styles.cartIcon} />
                        </div>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.buyNowPrice}>Buy now price: {formatCurrency(item.buy_now_price)}</p>
                    </div>

                    <div className={styles.infoBox}>
                        <p className={styles.infoText}>By proceeding, you agree to purchase this item immediately at the buy now price. This will end the auction for this item.</p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirmButton} onClick={handleConfirm} disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 className={styles.spinnerIcon} />
                                Processing...
                            </>
                        ) : (
                            "Confirm Purchase"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
