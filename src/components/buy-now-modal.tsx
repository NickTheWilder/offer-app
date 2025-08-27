import type { JSX } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShoppingCart } from "lucide-react";
import styles from "./buy-now-modal.module.css";
import { useAuth } from "@/hooks/use-auth";
import type { AuctionItemFragment } from "@/types/generated/graphql";

interface BuyNowModalProps {
    item: AuctionItemFragment;
    onClose: () => void;
}

export default function BuyNowModal({ item, onClose }: BuyNowModalProps): JSX.Element {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Format currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Get the current user
    const { user } = useAuth();

    // Submit buy now mutation using our mock API
    const buyNowMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("You must be logged in to make a purchase");
            if (!item.buyNowPrice) {
                throw new Error("This item does not have a buy now price");
            }

            const bid = {
                itemId: item.id,
                bidderId: user.id,
                amount: item.buyNowPrice,
                isBuyNow: true,
            };

            return await bid;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: [`/api/bids/item/${item.id}`] });
            queryClient.invalidateQueries({ queryKey: ["/api/bids/user"] });
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });

            // Show success toast
            toast({
                title: "Purchase successful",
                description: `You have successfully purchased ${item.name} for ${formatCurrency(item.buyNowPrice)}.`,
            });

            // Close the modal
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Purchase failed",
                description: error.message || "Failed to complete purchase",
                variant: "destructive",
            });
        },
    });

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
                        <p className={styles.buyNowPrice}>Buy now price: {formatCurrency(item.buyNowPrice)}</p>
                    </div>

                    <div className={styles.infoBox}>
                        <p className={styles.infoText}>By proceeding, you agree to purchase this item immediately at the buy now price. This will end the auction for this item.</p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirmButton} onClick={() => buyNowMutation.mutate()} disabled={buyNowMutation.isPending}>
                        {buyNowMutation.isPending ? (
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
